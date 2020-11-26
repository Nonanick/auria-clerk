import { Entity, ProcedureProxyWildcard } from "../entity/Entity";
import { UnknownEntityProcedure } from '../error/entity/UnknownEntityProcedure';
import { UnknownEntityProperty } from '../error/entity/UnknownEntityProperty';
import { UnrelatedProperty } from '../error/entity/UnrelatedProperty';
import { MaybePromise } from '../error/Maybe';
import { IHookModelProcedure } from '../hook/IHookProcedure';
import { IModelProcedureContext } from '../procedure/model/context/IModelProcedureContext';
import { IModelProcedureHook } from '../procedure/model/hook/IModelProcedureHook';
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IProperty } from "../property/IProperty";
import { Property } from '../property/Property';
import { PropertyGetProxy } from "../property/proxy/PropertyGetProxy";
import { PropertySetProxy } from "../property/proxy/PropertySetProxy";
import { IProxyModelProcedureRequest, IProxyModelProcedureResponse } from '../proxy/IProxyProcedure';
import { IQueryRequest, QueryRequest } from '../query';
import { ComparableValues } from '../query/filter/FilterComparison';
import { ValueHistory } from './history/ValueHistory';

class Model<T = any> {

  [prop: string]: any;

  protected $_entity: Entity;

  protected $_procedures: {
    [name: string]: IModelProcedure | string;
  } = {};

  protected $_idProperty: IProperty;

  protected $_proxies: ModelProxies = {
    get: {},
    set: {},
    procedures: {}
  };

  get $__proxies() {
    return this.$_proxies;
  }

  protected $_properties: { [name: string]: Property; } = {};

  protected $_values: ModelValues = {};

  protected $_valuesHistory: ValueHistory[] = [];

  protected $_changedProperties: string[] = [];

  protected $_hooks: ModelHooks = {};

  constructor(entity: Entity) {
    this.$_entity = entity;
    this.$_properties = entity.properties;
    this.$_idProperty = entity.identifier;

    return new Proxy(this, ProxiedModelHandler);
  }

  $addProcedure(procedure: IModelProcedure | string) {
    let procedureName = typeof procedure === "string" ? procedure : procedure.name;

    if (this.$_procedures[procedureName] != null) {
      console.error(
        'Cannot add duplicated procedure in model -> ',
        procedureName
      );
      return;
    }
    this.$_procedures[procedureName] = procedure;
  }

  $proxyProcedure(proxy: IProxyModelProcedureRequest | IProxyModelProcedureResponse): void {

    let procedure = proxy.procedure;

    if (typeof procedure === 'string') {
      procedure = [procedure];
    }

    for (let proc of procedure) {

      if (this.$_proxies.procedures[proc] == null) {
        this.$_proxies.procedures[proc] = { request: [], response: [] };
      }

      switch (proxy.proxies) {
        case 'request':
          this.$_proxies.procedures[proc].request.push(proxy as IProxyModelProcedureRequest);
          break;
        case 'response':
          this.$_proxies.procedures[proc].response.push(proxy as IProxyModelProcedureResponse);
          break;
      }
    }

  }

  $hookProcedure(
    hook: IHookModelProcedure
  ): Model {
    const procedure = hook.procedure;

    if (this.$_hooks[procedure] == null) {
      this.$_hooks[procedure] = [];
    }

    this.$_hooks[procedure].push(hook);
    return this;
  }

  $properties() {
    return this.$_entity.properties;
  }

  $propertyExists(property: string | keyof T): boolean {
    return this.$properties()[property] != null;
  }

  $source() {
    return this.$_entity.source;
  }

  $entity() {
    return this.$_entity;
  }

  $set(objectProperties: Partial<T> & ModelValues): boolean;
  $set(property: string, value: ComparableValues): boolean;
  $set(propOrObj: string | (Partial<T> & ModelValues), value?: ComparableValues): boolean {

    // Iterate though each property in the object!
    if (typeof propOrObj === 'object') {
      let allSet = true;

      for (let prop in propOrObj) {
        let val = propOrObj[prop];
        const propSet = this.$set(prop, val);
        allSet &&= propSet;
      }

      return allSet;
    }

    // Property exists ?
    if (!this.$propertyExists(propOrObj)) {
      console.error(
        'Property ',
        propOrObj,
        ' does not exists in model of source ',
        this.$_entity.name
      );
      return false;
    }

    let propField = this.$properties()[propOrObj];

    let setValue = propField.setProxy(value, this);
    if (setValue instanceof Error) {
      return false;
    }

    let isValid = propField.validate(value!, this);
    if (!(isValid instanceof Promise) && isValid !== true) {
      return false;
    }

    if (setValue != this.$_values[propOrObj]) {
      if (!this.$_changedProperties.includes(propOrObj)) {
        this.$_changedProperties.push(propOrObj);
      }
    }

    this.$_values[propOrObj] = setValue;
    return true;
  }

  $get(property: keyof T | string): any {

    if (!this.$propertyExists(property)) {
      return undefined;
    }

    let value: any = undefined;
    let propField = this.$properties()[property]!;

    // Value was set ?
    if (this.$_values[property] !== undefined) {
      value = this.$_values[property];
    }
    // If not try to use default
    else {
      if (propField.hasDefault()) {
        value = propField.syncGetDefault();
      }
    }

    value = propField.getProxy(value, this);
    return value;
  }

  $changedProperties(): string[] {
    return [...this.$_changedProperties];
  }

  async $json<T = any>(includePrivate: string[] = []): Promise<T> {
    let ret: any = {};

    for (let prop in this.$_properties) {

      let p = this.$_properties[prop];

      // do not include non-explicitly required private properties
      if (
        p.isPrivate()
        && !includePrivate.includes(prop)) {
        continue;
      }

      if (this.$_values[prop] !== undefined) {
        ret[prop] = this.$_values[prop];
        continue;
      }

      if (p.hasDefault()) {
        ret[prop] = await p.getDefault();
      }

    }

    return ret as T;
  }

  async $commit<T extends ModelValues = ModelValues>(validate = true): MaybePromise<T> {

    // Use default values for undefined props
    for (let p in this.$_properties) {
      if (this.$_values[p] === undefined) {
        let prop = this.$_properties[p];
        if (prop.hasDefault()) {
          this.$_values[p] = await prop.getDefault();
        }
      }
    }

    // Validate model
    if (validate === true) {
      let isValid = await this.$_entity.validate(this);
      if (isValid instanceof Error) {
        return isValid;
      }
    }

    // Create history
    this.$_valuesHistory.push(
      {
        changedProperties: this.$_changedProperties,
        committed_at: new Date(Date.now()),
        modelRef: this,
        values: this.$_values,
      }
    );

    // Update state
    this.$_changedProperties = [];

    return this.$_values as any;

  }

  async $id(): Promise<ComparableValues> {
    return await this.$get(this.$_entity.identifier.name);
  };

  $history(): ValueHistory[] {
    return this.$_valuesHistory;
  }

  $rollback(): boolean {
    if (this.$_valuesHistory.length > 1) {

      let lastHistory: ValueHistory = this.$_valuesHistory[this.$_valuesHistory.length - 1];

      this.$_changedProperties = [];
      this.$_values = lastHistory.values;

      return true;
    }
    return false;
  }

  async $execute(procedure: string, context?: IModelProcedureContext) {

    let isValid = await this.$commit(true);
    if (isValid instanceof Error) {
      return isValid;
    }

    if (this.$_procedures[procedure] == null) {
      throw new Error(
        `Procedure ${procedure} was not added to models of entity ${this.$_entity.name}!`
      );
    }

    let request: IModelProcedureRequest = {
      entity: this.$_entity,
      procedure: procedure,
      model: this,
    };

    context = {
      ...context
    };

    // Apply request wildcard proxies
    for (let modelProxy of this.$_proxies.procedures[ProcedureProxyWildcard]?.request ?? []) {
      let req = await modelProxy.apply(request, context);
      if (req instanceof Error) {
        return req;
      }
      request = req;
    }

    // Apply request specific proxies
    for (let modelProxy of this.$_proxies.procedures[procedure]?.request ?? []) {
      let req = await modelProxy.apply(request, context);
      if (req instanceof Error) {
        return req;
      }
      request = req;
    }


    const maybeResponse = await this.$entity().archive.digestRequest(request, context);
    if (maybeResponse instanceof Error) {
      return maybeResponse;
    }

    let response = maybeResponse;

    // Apply response wildcard proxies
    for (let modelProxy of this.$_proxies.procedures[procedure]?.response ?? []) {
      let res = await modelProxy.apply(response);
      if (res instanceof Error) {
        return res;
      }
      response = res;
    }

    // Apply response wildcard proxies
    for (let modelProxy of this.$_proxies.procedures[ProcedureProxyWildcard]?.response ?? []) {
      let res = await modelProxy.apply(response);
      if (res instanceof Error) {
        return res;
      }
      response = res;
    }

    return response;

  }

  async $related(propertyName: string, query?: Partial<IQueryRequest>) {

    if (this.$_properties[propertyName] == null) {
      return new UnknownEntityProperty(
        'Unknown property ' + propertyName + ' in model of entity ' + this.$_entity.name
      );
    }
    const property = this.$_properties[propertyName];
    if (!property.hasRelation()) {
      return new UnrelatedProperty(
        'Cannot fetch related data of property ' + propertyName + ' as it doesn\'t seem to have its relation declared!'
      );
    }

    const relation = property.getRelation()!;

    const fetchRelationQuery: IQueryRequest = {
      entity: relation.entity,
      properties: relation.returning,
      filters: {
        'associate': [relation.property, '=', this.$get(propertyName)],
        ...relation.filters,
      },
      limit: relation.limit,
      order: relation.order,
      ...query
    };

    return fetchRelationQuery;

  }

}

const ProxiedModelHandler: ProxyHandler<Model> = {

  get: (model, prop, receiver) => {

    if (
      String(prop).indexOf('$') === 0
    ) {
      return model[prop as any];
    }

    return model.$get(String(prop));
  },

  set: (model, prop, value, receiver) => {
    if (
      String(prop).indexOf('$') === 0
    ) {
      model[prop as any] = value;
      return true;
    }
    let setModelResponse = model.$set(String(prop), value);
    return setModelResponse;
  }
};

type ModelProxies = {
  get: {
    [propertyName: string]: PropertyGetProxy[];
  };
  set: {
    [propertyName: string]: PropertySetProxy[];
  };
  procedures: {
    [name: string]: {
      request: IProxyModelProcedureRequest[];
      response: IProxyModelProcedureResponse[];
    };
  };
};

type ModelHooks = {
  [procedureName: string]: IModelProcedureHook[];
};

export type ModelValues = {
  [name: string]: ComparableValues;
};

export { Model };