import { Entity } from "../entity/Entity";
import { MaybePromise } from '../error/Maybe';
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IProperty, IPropertyIdentifier } from "../property/IProperty";
import { Property } from '../property/Property';
import { PropertyGetProxy } from "../property/proxy/PropertyGetProxy";
import { PropertySetProxy } from "../property/proxy/PropertySetProxy";
import { ComparableValues } from '../query/filter/FilterComparison';
import { ValueHistory } from './history/ValueHistory';

export const ModelDefaultIdentifier: IPropertyIdentifier = {
  name: '_id',
  type: Number,
  unique: true,
}

class Model<T = unknown> {

  [prop: string]: any;

  protected $_entity: Entity;

  protected $_procedures: {
    [name: string]: IModelProcedure | string;
  } = {};

  protected $_idProperty: IProperty;

  protected $_proxies: ModelProxies = {
    get: {},
    set: {},
  };

  get $__proxies() {
    return this.$_proxies;
  }

  protected $_properties: { [name: string]: Property; } = {};

  protected $_values: ModelValues = {};

  protected $_valuesHistory: ValueHistory[] = [];

  protected $_changedProperties: string[] = [];

  constructor(entity: Entity) {
    this.$_entity = entity;

    this.$_properties = entity.properties;

    this.$_idProperty = (entity.identifier ?? { ...ModelDefaultIdentifier }) as IProperty;

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

  async $json<R = T>(includePrivate: string[] | '*' = []): Promise<R> {
    let ret: any = {};

    for (let prop in this.$_properties) {

      let p = this.$_properties[prop];

      // do not include non-explicitly required private properties, '*' == include all
      if (
        p.isPrivate()
        && (includePrivate != '*' && !includePrivate.includes(prop))
      ) {
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

    return ret as R;
  }

  async $commit(validate = true): MaybePromise<T> {

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
    return await this.$get(this.$_entity.identifier?.name ?? '_id');
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

}

const ProxiedModelHandler: ProxyHandler<Model<any>> = {

  get: (model, prop) => {

    if (
      String(prop).indexOf('$') === 0
    ) {
      return model[prop as any];
    }

    return model.$get(String(prop));
  },

  set: (model, prop, value) => {
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
};

export type ModelValues = {
  [name: string]: ComparableValues;
};

export { Model };
