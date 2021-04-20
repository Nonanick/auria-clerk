import { Except } from 'type-fest';
import { IArchive } from "../archive/IArchive";
import { MaybePromise } from "../error/Maybe";
import { IHookProcedure } from "../hook/IHookProcedure";
import { StoredModel } from '../model/StoredModel';
import { UniqueConstraint } from "../model/validate/UniqueConstraint";
import {
  IEntityProcedure,
  IEntityProcedureRequest,
  IEntityProcedureResponse,
  IModelProcedure,
  IModelProcedureContext,
  IModelProcedureRequest,
} from "../procedure";
import { IModelProcedureResponse } from "../procedure/model/IModelProcedureResponse";
import { IProperty, IPropertyIdentifier, Property } from "../property";
import {
  IProxyEntityProcedureRequest,
  IProxyEntityProcedureResponse,
  IProxyModelProcedureRequest,
  IProxyModelProcedureResponse,
  IProxyProcedure,
} from "../proxy/IProxyProcedure";
import { ComparableValues, IQueryRequest, QueryRequest } from "../query";
import { Store } from "../store/Store";
import { Entity } from "./Entity";
import { Factory } from "./Factory";
import { IEntity } from "./IEntity";

export class StoredEntity<T = unknown> extends Entity<T> {
  #store: Store;

  #archive: IArchive;

  #factory: Factory;

  #proxies: EntityProxies = {};

  #hooks: EntityHooks = {};

  #procedures: EntityProcedures = {
    model: {},
    entity: {},
  };

  constructor(entityInfo: IEntity, store: Store, factory: Factory) {
    super(entityInfo);

    this.#factory = factory;
    this.#store = store;
    this.#archive = factory.archive;

    if (entityInfo.identifier == null) {
      this._properties[factory.defaultIdentifier.name] = new Property(
        { ...factory.defaultIdentifier } as IProperty
        );
    }

    // Procedures
    this.#procedures.entity = entityInfo.procedures?.ofEntity ?? {};
    this.#procedures.model = entityInfo.procedures?.ofModel ?? {};

    // Proxies
    if (Array.isArray(entityInfo.proxy)) {
      for (let proxy of entityInfo.proxy ?? []) {
        this.#proxies[proxy.name]! = {
          ...proxy,
        } as IProxyProcedure;
      }
    } else {
      for (let proxyName in entityInfo.proxy ?? {}) {
        this.#proxies[proxyName]! = {
          name: proxyName,
          ...entityInfo.proxy![proxyName],
        } as IProxyProcedure;
      }
    }

    // Hooks
    for (let hookName in entityInfo.hooks ?? {}) {
      this.#hooks[hookName]! = {
        name: hookName,
        ...entityInfo.hooks![hookName],
      } as IHookProcedure;
    }

    // Unique constraint validation?
    if (this.hasUnique()) {
      this.addProxy("unique-constraint", UniqueConstraint);
    }
  }

  get identifier(): IPropertyIdentifier {
    return this._entity.identifier != null
      ? this._entity.identifier
      : { ...this.#factory.defaultIdentifier };
  }

  get archive(): IArchive {
    if (this.#archive == null) {
      throw new Error("No archive defined for this entity");
    }

    return this.#archive;
  }

  get proceduresFor() {
    return { ...this.#procedures };
  }

  addProcedure = {
    forEntity: (...procedures: IEntityProcedure[]) => {
      for (let procedure of procedures) {
        this.#procedures.entity[procedure.name] = procedure;
      }
    },
    forModel: (...procedures: IModelProcedure[]) => {
      for (let procedure of procedures) {
        this.#procedures.model[procedure.name] = procedure;
      }
    },
  };

  addHook(name: string, hook: IHookProcedure) {
    this.#hooks[name] = hook;
  }

  addProxy(name: string, proxy: IProxyProcedure) {
    this.#proxies[name] = proxy;
  }

  get requestProxies() {
    return Object.values(this.#proxies).filter(proxy => proxy.proxies === "request");
  }

  get responseProxies() {
    return Object.values(this.#proxies).filter(proxy => proxy.proxies === "response");
  }

  async applyRequestProxies(request: IEntityProcedureRequest, context?: any) {
    let procedure = request.procedure;

    for (let proxyName in this.#proxies ?? {}) {
      const proxy = this.#proxies[proxyName];
      const proxyMatchesCurrentProcedure =
        proxy.procedure === ProcedureProxyWildcard ||
        (
          Array.isArray(proxy.procedure)
            ? proxy.procedure.includes(procedure)
            : proxy.procedure === procedure
        );

      if (
        // Applies to entity
        proxy.appliesTo === "entity" &&
        proxy.proxies === "request" &&
        // Wildcard procedure OR requested procedure
        proxyMatchesCurrentProcedure
      ) {
        let newRequest = await (proxy as IProxyEntityProcedureRequest).apply(
          request,
          context,
        );
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

    for (let proxyName in this.#proxies ?? {}) {
      const proxy = this.#proxies[proxyName];
      const proxyMatchesCurrentProcedure =
        proxy.procedure === ProcedureProxyWildcard ||
        (
          Array.isArray(proxy.procedure)
            ? proxy.procedure.includes(procedure)
            : proxy.procedure === procedure
        );
      if (
        // Applies to entity
        proxy.appliesTo === "entity" &&
        proxy.proxies === "response" &&
        // Wildcard procedure OR requested procedure
        proxyMatchesCurrentProcedure
      ) {
        let newResponse = await (proxy as IProxyEntityProcedureResponse).apply(
          response,
        );
        if (newResponse instanceof Error) {
          return newResponse;
        }
        response = newResponse;
      }
    }

    return response;
  }

  async applyRequestModelProxies(request: IModelProcedureRequest, context : IModelProcedureContext) {
    let procedure = request.procedure;

    for (let proxyName in this.#proxies ?? {}) {
      const proxy = this.#proxies[proxyName];
      const proxyMatchesCurrentProcedure =
        proxy.procedure === ProcedureProxyWildcard ||
        (
          Array.isArray(proxy.procedure)
            ? proxy.procedure.includes(procedure)
            : proxy.procedure === procedure
        );

      if (
        // Applies to entity
        proxy.appliesTo === "model" &&
        proxy.proxies === "request" &&
        // Wildcard procedure OR requested procedure
        proxyMatchesCurrentProcedure
      ) {
        let newRequest = await (proxy as IProxyModelProcedureRequest).apply(
          request,
          context,
        );
        if (newRequest instanceof Error) {
          return newRequest;
        }
        request = newRequest as IModelProcedureRequest;
      }
    }

    return request;
  }

  async applyResponseModelProxies(response: IModelProcedureResponse) {
    let procedure = response.procedure;

    for (let proxyName in this.#proxies ?? {}) {
      const proxy = this.#proxies[proxyName];
      const proxyMatchesCurrentProcedure =
        proxy.procedure === ProcedureProxyWildcard ||
        (
          Array.isArray(proxy.procedure)
            ? proxy.procedure.includes(procedure)
            : proxy.procedure === procedure
        );
      if (
        // Applies to entity
        proxy.appliesTo === "model" &&
        proxy.proxies === "response" &&
        // Wildcard procedure OR requested procedure
        proxyMatchesCurrentProcedure
      ) {
        let newResponse = await (proxy as IProxyModelProcedureResponse).apply(
          response,
        );
        if (newResponse instanceof Error) {
          return newResponse;
        }
        response = newResponse;
      }
    }

    return response;
  }

  async execute(
    procedure: string,
    context: any,
  ): MaybePromise<IEntityProcedureResponse> {
    return this.store().execute(procedure, this, context);
  }

  async executeOnModel(
    model: StoredModel,
    procedure: string,
    context: any,
  ): MaybePromise<IModelProcedureResponse> {
    return this.store().execute(procedure, model, context);
  }

  model<DTO = T>(values?: Partial<DTO>): StoredModelOf<DTO> {
    let model = new StoredModel(this) as StoredModelOf<DTO>;

    // push procedures
    for (let procedure in this.#procedures.model) {
      model.$addProcedure(this.#procedures.model[procedure]);
    }

    // push procedure proxies
    for (let proxyName in this.#proxies) {
      const proxy = this.#proxies[proxyName];
      if (proxy.appliesTo === "model") {
        model.$proxyProcedure(proxy);
      }
    }

    // push procedure hooks
    for (let hookName in this.#hooks) {
      const hook = this.#hooks[hookName];
      if (hook.appliesTo === "model") {
        model.$hookProcedure(hook);
      }
    }

    if (values != null) {
      model.$set(values);
    }

    return model;
  }

  store(): Store {
    return this.#store;
  }

  query<T = {}>(request?: Except<IQueryRequest, "entity">): QueryRequest<T> {
    return this.#store.query(this.name, request);
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


export type StoredModelOf<T = unknown> = T & StoredModel<T> & {
  $set(props: Partial<T>): boolean;
  $get(propName: keyof T): ComparableValues;
};

export const ProcedureProxyWildcard = "_";
