import { IArchive } from '../archive/IArchive';
import { UnknownEntityProcedure } from '../error/entity/UnknownEntityProcedure';
import { MaybePromise } from '../error/Maybe';
import { IHookProcedure } from '../hook/IHookProcedure';
import { Model } from "../model/Model";
import { ModelOf } from '../model/ModelOf';
import { IModelValidation } from '../model/validate/IModelValidation';
import { IEntityProcedure } from '../procedure/entity/IEntityProcedure';
import { IEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedure } from '../procedure/model/IModelProcedure';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { IPropertyIdentifier } from "../property/IProperty";
import { Property } from '../property/Property';
import {
  IProxyEntityProcedureRequest,
  IProxyProcedure,
  IProxyEntityProcedureResponse
} from '../proxy/IProxyProcedure';
import { IFilterQuery } from "../query/filter/IFilterQuery";
import { IQueryRequest } from '../query/IQueryRequest';
import { IOrderBy } from "../query/order/IOrderBy";
import { QueryRequest } from "../query/QueryRequest";
import { Factory } from "./Factory";
import { IEntity } from "./IEntity";

export class Entity<T = any> {

  protected _factory: Factory;

  protected _entity: IEntity;

  protected _archive: IArchive;

  get archive(): IArchive {
    return this._archive;
  }

  protected _procedures: EntityProcedures = {
    model: {},
    entity: {}
  };

  protected _properties: {
    [name: string]: Property;
  } = {};

  protected _proxies: EntityProxies = {
  };

  protected _hooks: EntityHooks = {
  };

  get name(): string {
    return this._entity.name;
  }

  get filters(): IFilterQuery {
    return this._entity.filters ?? {};
  }

  get proceduresFor() {
    return this._procedures;
  }

  hasFilters(): boolean {
    let keys = Object.keys(this.filters);
    return keys.length > 0;
  }

  get orderBy(): IOrderBy | undefined {
    return this._entity.orderBy != null ?
      typeof this._entity.orderBy === 'string' ?
        { property: this._entity.orderBy }
        : { ... this._entity.orderBy }
      : undefined;
  }

  hasOrdering(): boolean {
    return this.orderBy != null;
  }

  get identifier(): IPropertyIdentifier {
    return this._entity.identifier != null ?
      this._entity.identifier
      : { ...this._factory.defaultIdentifier };
  }

  get source(): string {
    return this._entity.source ?? this._entity.name;
  }

  get properties(): { [name: string]: Property; } {
    return this._properties;
  }

  constructor(init: IEntity, factory: Factory) {

    this._entity = init;
    this._factory = factory;

    // Properties
    let idProp = new Property(init.identifier ?? this._factory.defaultIdentifier);
    this._properties[idProp.name] = idProp;
    for (let propName in this._entity.properties) {
      this._properties[propName] = new Property({
        name: propName,
        ...this._entity.properties[propName]
      });;
    }

    this._archive = factory.archive;

    // Procedures
    this._procedures.entity = init.procedures?.entity ?? {};
    this._procedures.model = init.procedures?.model ?? {};

    // Proxies
    this._proxies = init.proxy ?? {};

    // Hooks
    this._hooks = init.hooks ?? {};
  }

  query<T = any>(request?: Omit<IQueryRequest, "entity">): QueryRequest<T> {
    throw new Error('Entity must be initialized by a Store');
  }

  model(): ModelOf<T> {
    let model = new Model(this);

    // push procedures
    for (let procedure in this._procedures.model) {
      model.$addProcedure(this._procedures.model[procedure]);
    }

    // push procedure proxies
    for (let proxyName in this._proxies) {
      const proxy = this._proxies[proxyName];
      if (proxy.appliesTo === "model") {
        model.$proxyProcedure(proxy);
      }
    }

    // push procedure hooks
    for (let hookName in this._hooks) {
      const hook = this._hooks[hookName];
      if (hook.appliesTo === "model") {
        model.$hookProcedure(hook);
      }
    }

    return model as ModelOf<T>;
  }

  async execute(procedure: string, context: any): MaybePromise<IEntityProcedureResponse> {
    throw new Error('Entity must be initialized by a Store');
  }

  async executeOnModel(model: Model, procedure: string, context: any): MaybePromise<IModelProcedureResponse> {
    throw new Error('Entity must be initialized by a Store');
  }

  async applyRequestProxies(request: IEntityProcedureRequest, context?: any) {
    let procedure = request.procedure;

    for (let proxyName in this._proxies ?? {}) {

      const proxy = this._proxies[proxyName];
      const proxyMatchesCurrentProcedure =
        proxy.procedure === ProcedureProxyWildcard
        || (
          Array.isArray(proxy.procedure)
            ? proxy.procedure.includes(procedure)
            : proxy.procedure === procedure
        );

      if (
        // Applies to entity
        proxy.appliesTo === "entity"
        && proxy.proxies === "request"
        // Wildcard procedure OR requested procedure
        && proxyMatchesCurrentProcedure
      ) {
        let newRequest = await (proxy as IProxyEntityProcedureRequest).apply(request, context);
        if (newRequest instanceof Error) {
          return newRequest;
        }
        request = newRequest as IEntityProcedureRequest<any>;
      }
    }

    return request;
  }

  async applyResponseProxies(response: IEntityProcedureResponse) {
    let procedure = response.procedure;

    for (let proxyName in this._proxies ?? {}) {
      const proxy = this._proxies[proxyName];
      const proxyMatchesCurrentProcedure =
        proxy.procedure === ProcedureProxyWildcard
        || (
          Array.isArray(proxy.procedure)
            ? proxy.procedure.includes(procedure)
            : proxy.procedure === procedure
        );
      if (
        // Applies to entity
        proxy.appliesTo === "entity"
        && proxy.proxies === "response"
        // Wildcard procedure OR requested procedure
        && proxyMatchesCurrentProcedure
      ) {
        let newResponse = await (proxy as IProxyEntityProcedureResponse).apply(response);
        if (newResponse instanceof Error) {
          return newResponse;
        }
        response = newResponse;
      }
    }

    return response;
  }

  // Apply all validations to model
  async validate(model: Model): MaybePromise<true> {

    if (this._entity.validate == null) {
      return true;
    }
    let validations: IModelValidation[] = [];

    if (!Array.isArray(this._entity.validate)) {
      validations = [this._entity.validate];
    } else {
      validations = this._entity.validate;
    }

    for (let validation of validations) {
      let isValid = validation.validation(model);

      if (isValid instanceof Promise) {
        isValid = await isValid;
      }

      if (isValid instanceof Error) {
        return isValid;
      }
    }

    return true;
  }

  addHook(name: string, hook: IHookProcedure) {
    this._hooks[name] = hook;
  }

  addProxy(name: string, proxy: IProxyProcedure) {
    this._proxies[name] = proxy;
  }

}

type EntityProcedures = {
  model: {
    [name: string]: IModelProcedure;
  };
  entity: {
    [name: string]: IEntityProcedure;
  };
};

type EntityProxies = {
  [name: string]: IProxyProcedure;
};

type EntityHooks = {
  [name: string]: IHookProcedure;
};

export const ProcedureProxyWildcard = '_';