import { Entity } from "../entity/Entity";
import { MaybePromise } from '../error/Maybe';
import { IModelProcedureHook } from '../procedure/model/hook/IModelProcedureHook';
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IProxyModelProcedureRequest } from "../procedure/model/proxy/IProxyModelProcedureRequest";
import { IProxyModelProcedureResponse } from "../procedure/model/proxy/IProxyModelProcedureResponse";
import { IProperty } from "../property/IProperty";
import { Property } from '../property/Property';
import { PropertyGetProxy } from "../property/proxy/PropertyGetProxy";
import { PropertySetProxy } from "../property/proxy/PropertySetProxy";
import { ComparableValues } from '../query/filter/FilterComparisson';
import { ValueHistory } from './history/ValueHistory';
import { ResolveDefaultValue } from '../property/default/DefaultValue';


type ModelHooks = {
  [procedureName: string]: IModelProcedureHook[];
};

class Model {

  [prop: string]: any;

  protected $_entity: Entity;

  protected $_procedures: {
    [name: string]: IModelProcedure;
  } = {};

  protected $_idProperty: IProperty;

  protected $_proxies: ModelProxies = {
    get: {},
    set: {},
    procedures: {}
  };

  get __proxies() {
    return this.$_proxies;
  }

  protected $_properties: { [name: string]: Property; } = {};

  protected $_values: any = {};

  protected $_valuesHistory: ValueHistory[] = [];

  protected $_changedProperties: string[] = [];

  protected $_hooks: ModelHooks = {};

  constructor(entity: Entity) {
    this.$_entity = entity;
    this.$_properties = entity.properties;
    this.$_idProperty = entity.identifier;

    return new Proxy(this, ProxiedModelHandler);
  }

  $addProcedure(procedure: IModelProcedure) {
    if (this.$_procedures[procedure.name] != null) {
      console.error(
        'Cannot add duplicated procedure in model -> ',
        procedure.name
      );
      return;
    }
    this.$_procedures[procedure.name] = procedure;
  }

  $proxyProcedure(
    type: 'request',
    procedure: string,
    proxy: IProxyModelProcedureRequest
  ): void;
  $proxyProcedure(
    type: 'response',
    procedure: string,
    proxy: IProxyModelProcedureResponse
  ): void;
  $proxyProcedure(
    type: 'request' | 'response',
    procedure: string,
    proxy: IProxyModelProcedureRequest | IProxyModelProcedureResponse
  ): void {
    if (this.$_proxies.procedures[procedure] == null) {
      this.$_proxies.procedures[procedure] = {
        request: [],
        response: []
      };
    }

    switch (type) {
      case 'request':
        this.$_proxies.procedures[procedure].request.push(proxy);
        break;
      case 'response':
        this.$_proxies.procedures[procedure].response.push(proxy);
        break;
    }

  }

  $hookProcedure(
    procedure: string,
    hook: IModelProcedureHook
  ): Model {
    if (this.$_hooks[procedure] == null) {
      this.$_hooks[procedure] = [];
    }
    this.$_hooks[procedure].push(hook);
    return this;
  }

  $properties() {
    return this.$_entity.properties;
  }

  $propertyExists(property: string): boolean {
    return this.$properties()[property] != null;
  }

  $source() {
    return this.$_entity.source;
  }

  $set(property: string, value: any): boolean {

    // Property exists ?
    if (!this.$propertyExists(property)) {
      console.error(
        'Property ',
        property,
        ' does not exists in model of source ',
        this.$_entity.name
      );
      return false;
    }

    let propField = this.$properties()[property];

    let setValue = propField.setProxy(value, this);
    if (setValue instanceof Error) {
      return false;
    }

    let isValid = propField.validate(value, this);
    if (isValid !== true) {
      return false;
    }

    if (setValue != this.$_values[property]) {
      if (!this.$_changedProperties.includes(property)) {
        this.$_changedProperties.push(property);
      }
    }

    this.$_values[property] = setValue;
    return true;
  }

  $get(property: string): any {

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

  async $commit<T = any>(validate = true): MaybePromise<T> {

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
        comitted_at: new Date(Date.now()),
        modelRef: this,
        values: this.$_values,
      }
    );

    // Update state
    this.$_changedProperties = [];

    return this.$_values;

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

  async $execute(procedure: string) {
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

    return await this.$_procedures[procedure].execute(request, {});
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

export { Model };

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