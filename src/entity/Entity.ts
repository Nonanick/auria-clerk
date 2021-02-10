import { isPropertyType } from '../property/type/IPropertyType';
import { IArchive } from '../archive/IArchive';
import { MaybePromise } from '../error/Maybe';
import { IHookProcedure } from '../hook/IHookProcedure';
import { Model } from "../model/Model";
import { ModelOf } from '../model/ModelOf';
import { IModelValidation } from '../model/validate/IModelValidation';
import { UniqueConstraint } from '../model/validate/UniqueConstraint';
import { IEntityProcedure } from '../procedure/entity/IEntityProcedure';
import { IEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedure } from '../procedure/model/IModelProcedure';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { IProperty, IPropertyIdentifier, ValidPropertyType } from "../property/IProperty";
import { Property } from '../property/Property';
import {
  IProxyEntityProcedureRequest,

  IProxyEntityProcedureResponse, IProxyProcedure
} from '../proxy/IProxyProcedure';
import { IFilterQuery } from "../query/filter/IFilterQuery";
import { IQueryRequest } from '../query/IQueryRequest';
import { IOrderBy } from "../query/order/IOrderBy";
import { QueryRequest } from "../query/QueryRequest";
import { Store } from '../store/Store';
import { Factory } from "./Factory";
import { IEntity } from "./IEntity";

export class Entity<T = unknown> {

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

  protected _proxies: EntityProxies = {};

  protected _hooks: EntityHooks = {};

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
    let hasUnique: boolean = false;

    let idProp = new Property(init.identifier ?? this._factory.defaultIdentifier);
    this._properties[idProp.name] = idProp;
    for (let propName in this._entity.properties) {
      let mustBeProp: ValidPropertyType | (Omit<IProperty, "name"> & {}) = this._entity.properties[propName];

      if (isPropertyType(mustBeProp) ||
        [String, Number, Boolean, Object, Date].includes(mustBeProp as any)
      ) {
        mustBeProp = {
          name: propName,
          type: mustBeProp as ValidPropertyType
        };
      } else {
        mustBeProp = {
          name: propName,
          ...mustBeProp as (Omit<IProperty, "name">)
        };
      }

      this._properties[propName] = new Property(mustBeProp as IProperty);

      if (this._properties[propName].isUnique()) {
        hasUnique = true;
      }

    }

    this._archive = factory.archive;

    // Procedures
    this._procedures.entity = init.procedures?.ofEntity ?? {};
    this._procedures.model = init.procedures?.ofModel ?? {};

    // Proxies
    for (let proxyName in init.proxy ?? {}) {
      this._proxies[proxyName]! = {
        name: proxyName,
        ...init.proxy![proxyName]
      } as IProxyProcedure;
    }

    // Hooks
    for (let hookName in init.hooks ?? {}) {
      this._hooks[hookName]! = {
        name: hookName,
        ...init.hooks![hookName]
      } as IHookProcedure;
    }

    // Unique constraint validation?
    if (hasUnique) {
      this.addProxy('unique-constraint', UniqueConstraint);
    }

  }

  store(): Store {
    throw new Error('Entity must be initialized by a Store');
  }

  query<T = {}>(request?: Omit<IQueryRequest, "entity">): QueryRequest<T> {
    throw new Error('Entity must be initialized by a Store');
  };

  model<DTO = T>(): ModelOf<DTO> {
    let model = new Model<DTO>(this);

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

    return model as ModelOf<DTO>;
  }

  async execute(procedure: string, context: any): MaybePromise<IEntityProcedureResponse> {
    throw new Error('Entity must be initialized by a Store');
  };

  async executeOnModel(model: Model, procedure: string, context: any): MaybePromise<IModelProcedureResponse> {
    throw new Error('Entity must be initialized by a Store');
  };

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

      while (isValid instanceof Promise) {
        isValid = await isValid;
      }

      if (isValid instanceof Error) {
        return isValid;
      }
    }

    return true as true;
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
    [name: string]: IModelProcedure | string;
  };
  entity: {
    [name: string]: IEntityProcedure | string;
  };
};

type EntityProxies = {
  [name: string]: IProxyProcedure;
};

type EntityHooks = {
  [name: string]: IHookProcedure;
};

export const ProcedureProxyWildcard = '_';