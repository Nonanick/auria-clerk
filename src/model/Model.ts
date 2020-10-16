import { Entity } from "../entity/Entity";
import { Maybe, MaybePromise } from '../error/Maybe';
import { IModelProcedureHook } from '../procedure/model/hook/IModelProcedureHook';
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IProxyModelProcedureRequest } from "../procedure/model/proxy/IProxyModelProcedureRequest";
import { IProxyModelProcedureResponse } from "../procedure/model/proxy/IProxyModelProcedureResponse";
import { IProperty } from "../property/IProperty";
import { Property } from '../property/Property';
import { PropertyGetProxy } from "../property/proxy/PropertyGetProxy";
import { PropertySetProxy } from "../property/proxy/PropertySetProxy";

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

class Model {

  protected _entity: Entity;

  protected _procedures: {
    [name: string]: IModelProcedure;
  } = {};

  protected _idProperty: IProperty;

  protected _proxies: ModelProxies = {
    get: {},
    set: {},
    procedures: {}
  };

  get __proxies() {
    return this._proxies;
  }

  protected _properties: { [name: string]: Property; } = {};

  protected _values: any;

  protected _changedProperties: string[] = [];

  protected _hooks: ModelHooks = {};

  constructor(entity: Entity) {
    this._entity = entity;
    this._properties = entity.properties;
    this._idProperty = entity.identifier;

    return new Proxy(this, ProxiedModelHandler);
  }

  $addProcedure(procedure: IModelProcedure) {
    if (this._procedures[procedure.name] == null) {
      console.error(
        'Cannot add duplicated procedure in model -> ',
        procedure.name
      );
      return;
    }
    this._procedures[procedure.name] = procedure;
  }

  $addProcedureProxy(
    type: 'request',
    procedure: string,
    proxy: IProxyModelProcedureRequest
  ): void;
  $addProcedureProxy(
    type: 'response',
    procedure: string,
    proxy: IProxyModelProcedureResponse
  ): void;
  $addProcedureProxy(
    type: 'request' | 'response',
    procedure: string,
    proxy: IProxyModelProcedureRequest | IProxyModelProcedureResponse
  ): void {
    if (this._proxies.procedures[procedure] == null) {
      this._proxies.procedures[procedure] = {
        request: [],
        response: []
      };
    }

    switch (type) {
      case 'request':
        this._proxies.procedures[procedure].request.push(proxy);
        break;
      case 'response':
        this._proxies.procedures[procedure].response.push(proxy);
        break;
    }

  }

  $properties() {
    return this._entity.properties;
  }

  $propertyExists(property: string): boolean {
    return this.$properties()[property] != null;
  }

  $source() {
    return this._entity.source;
  }

  $set(property: string, value: any): boolean {

    // Property exists ?
    if (!this.$propertyExists(property)) {
      console.error(
        'Property ',
        property,
        ' does not exists in model of source ',
        this._entity.name
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

    if (setValue != this._values[property]) {
      if (!this._changedProperties.includes(property)) {
        this._changedProperties.push(property);
      }
    }

    this._values[property] = setValue;
    return true;
  }

  $get(property: string): any {
    if (!this.$propertyExists(property)) {
      console.warn(
        'Trying to access unknown property ',
        property,
        ' on model of source ',
        this._entity.name
      );
      return undefined;
    }

    let value: any = undefined;
    let propField = this.$properties()[property]!;

    // Value was set ?
    if (this._values[property] !== undefined) {
      value = this._values[property];
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
    return [...this._changedProperties];
  }

  async $json<T = any>(): Promise<T> {
    let ret: any = {};

    for (let prop in this._properties) {

      if (this._values[prop] !== undefined) {
        ret[prop] = this._values[prop];
        continue;
      }

      let p = this._properties[prop];

      if (p.hasDefault()) {
        ret[prop] = await p.getDefault();
      }

    }

    return ret as T;
  }

  async $commit(): MaybePromise<true> {

    // Validate model
    let isValid = await this._entity.validate(this);
    if (isValid instanceof Error) {
      return isValid;
    }

    // Fire hooks

    return true;

  }

}

const ProxiedModelHandler: ProxyHandler<Model> = {

  get: (model, prop, receiver) => {
    return model.$get(String(prop));
  },

  set: (model, prop, value, receiver) => {
    let setModelResponse = model.$set(String(prop), value);
    return setModelResponse;
  }
};

export { Model };