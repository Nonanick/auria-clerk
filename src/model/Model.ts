import { Entity } from "../entity/Entity";
import { IModelProcedureHook } from '../procedure/model/hook/IModelProcedureHook';
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IProxyModelProcedureRequest } from "../procedure/model/proxy/IProxyModelProcedureRequest";
import { IProxyModelProcedureResponse } from "../procedure/model/proxy/IProxyModelProcedureResponse";
import { ResolveDefaultValue } from "../property/default/DefaultValue";
import { IProperty } from "../property/IProperty";
import { PropertyGetProxy } from "../property/proxy/PropertyGetProxy";
import { PropertySetProxy } from "../property/proxy/PropertySetProxy";

type ModelProxies = {
  get: PropertyGetProxy[];
  set: PropertySetProxy[];
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
    get: [],
    set: [],
    procedures: {}
  };

  get proxies() {
    return this._proxies;
  }

  protected _properties: { [name: string]: Omit<IProperty, "name">; } = {};

  protected _values: any;

  protected _hooks: ModelHooks = {};

  constructor(entity: Entity) {
    this._entity = entity;
    this._properties = entity.properties;
    this._idProperty = entity.identifier;
  }

  addProcedure(procedure: IModelProcedure) {
    if (this._procedures[procedure.name] == null) {
      console.error(
        'Cannot add duplicated procedure in model -> ',
        procedure.name
      );
      return;
    }
    this._procedures[procedure.name] = procedure;
  }

  addProcedureProxy(
    type: 'request',
    procedure: string,
    proxy: IProxyModelProcedureRequest
  ): void;
  addProcedureProxy(
    type: 'response',
    procedure: string,
    proxy: IProxyModelProcedureResponse
  ): void;
  addProcedureProxy(
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

  async json<T = any>(): Promise<T> {
    let ret: any = {};

    for (let prop in this._properties) {

      if (this._values[prop] !== undefined) {
        ret[prop] = this._values[prop];
        continue;
      }

      let p = this._properties[prop];

      if (p.default != null) {
        ret[prop] = await ResolveDefaultValue(p.default);
      }
    }
    return ret as T;
  }

}



let ProxiedModelHandler: ProxyHandler<Model> =
{
  get: (model, prop, receiver) => {
    return (model as any)[prop];
  },
  set: (model, prop, value, receiver) => {

    return true;
  }
};


class ProxiedModel extends Model {

  constructor(entity: Entity) {
    super(entity);

    return new Proxy(
      this,
      ProxiedModelHandler
    );

  }
}

export { ProxiedModel as Model };