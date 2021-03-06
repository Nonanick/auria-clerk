import { Except } from 'type-fest';
import { ArchiveProcedureHook } from '../archive/ArchiveProcedureHook';
import { ArchiveProcedureProxy } from '../archive/ArchiveProcedureProxy';
import { Entity } from "../entity/Entity";
import { Factory } from "../entity/Factory";
import { IEntity } from "../entity/IEntity";
import { ProcedureProxyWildcard, StoredEntity } from '../entity/StoredEntity';
import { AppException } from "../error/AppException";
import { Maybe, MaybePromise } from '../error/Maybe';
import { IHookProcedure } from '../hook/IHookProcedure';
import { Model } from '../model/Model';
import { StoredModel } from '../model/StoredModel';
import { IEntityProcedure } from '../procedure/entity/IEntityProcedure';
import { IEntityProcedureRequest, implementsEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse, implementsEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedure } from '../procedure/model/IModelProcedure';
import { IModelProcedureRequest, implementsModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IModelProcedureResponse, implementsModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { implementsProxyProcedure } from '../proxy/IProxyProcedure';
import { implementsProxyQuery, IProxyQuery } from '../proxy/IProxyQuery';
import { IQueryRequest } from '../query/IQueryRequest';
import { QueryRequest } from "../query/QueryRequest";

export class Store {

  protected _entities: {
    [name: string]: StoredEntity;
  } = {};

  protected _defaultFactory: Factory;

  protected _queryProxies: IProxyQuery[] = [];

  protected _procedureProxies: ArchiveProcedureProxy[] = [];

  protected _procedureHooks: IHookProcedure[] = [];

  constructor(defaultFactory: Factory | ClassOfFactory) {
    if (defaultFactory instanceof Factory) {
      this._defaultFactory = defaultFactory;
    } else {
      this._defaultFactory = new defaultFactory();
    }
  }

  query<T = {}>(entity: string, request?: Except<IQueryRequest, "entity">): QueryRequest<T> {

    if (this._entities[entity] == null) {
      throw new AppException('Cannot query unknown entity ' + entity + ' does it exist on this store?');
    }

    let entityInst = this._entities[entity];
    let q = new QueryRequest<T>(entityInst);
    if (request !== undefined) {
      q.loadQueryRequest(request);
    }
    return q;
  }

  addProxy(...proxies: (ArchiveProcedureProxy | IProxyQuery)[]) {
    for (const proxy of proxies) {
      if (implementsProxyProcedure(proxy)) {
        this._procedureProxies.push(proxy);
        continue;
      }

      if (implementsProxyQuery(proxy)) {
        this._queryProxies.push(proxy);
        continue;
      }

      console.error('Failed to determine proxy nature added to the store!');
    }
  }

  addHook(...hooks: ArchiveProcedureHook[]) {
    this._procedureHooks.push(...hooks);
  }

  removeHook(...hooks: ArchiveProcedureHook[]) {
    this._procedureHooks = this._procedureHooks.filter(h => !hooks.includes(h));
  }

  async execute(procedure: string, on: StoredModel, context: any): MaybePromise<IModelProcedureResponse>;
  async execute(procedure: string, on: StoredEntity, context: any): MaybePromise<IEntityProcedureResponse>;
  async execute(
    procedure: string,
    on: StoredEntity | StoredModel,
    context: any
  ): MaybePromise<IEntityProcedureResponse | IModelProcedureResponse> {

    let entity = on instanceof StoredEntity ? on : on.$entity();
    let procedureAppliesTo: 'entity' | 'model' = on instanceof Entity ? 'entity' : 'model';

    if (entity.proceduresFor[procedureAppliesTo][procedure] == null) {
      return new AppException(
        'Entity does not have a procedure for "' + procedureAppliesTo + '" named ' + procedure
      );
    }

    let request: IModelProcedureRequest | IEntityProcedureRequest;

    if (on instanceof Entity) {
      request = { procedure, entity, context };
    }

    if (on instanceof Model) {
      request = { model: on, context, entity, procedure };
    }

    if (request! == null) {
      throw new AppException('Unknown procedure target, expecting Entity or Model instances!');
    }

    // Let Entiti proxy the request
    let proxiedByEntity : any;
    if(implementsModelProcedureRequest(request)) {
      proxiedByEntity = request.entity.applyRequestModelProxies(request, context);
    } else {
      proxiedByEntity = request.entity.applyRequestProxies(request, context);
    }
    if(proxiedByEntity instanceof Error) {
      return proxiedByEntity
    }

    // Let store proxy the request
    const proxiedRequest = await this.applyRequestProxies(proxiedByEntity, context);
    if (proxiedRequest instanceof Error) {
      return proxiedRequest;
    }

    const maybeResponse = await entity.archive.resolveRequest(request as any, context);
    if (maybeResponse instanceof Error) {
      return maybeResponse;
    }

    const proxiedResponse = await this.applyResponseProxies(maybeResponse);
    if (proxiedResponse instanceof Error) {
      return proxiedResponse;
    }

    let responseProxiedByEntity : MaybePromise<IModelProcedureResponse | IEntityProcedureResponse>;

    if(implementsModelProcedureResponse(proxiedResponse)) {
      responseProxiedByEntity = request.entity.applyResponseModelProxies(proxiedResponse);
    } else {
      responseProxiedByEntity = request.entity.applyResponseProxies(proxiedResponse);
    }

    return responseProxiedByEntity;
  }

  add(...entities: (IEntity | CustomFactoryEntity)[]) {

    for (let entityToAdd of entities) {

      let factory: Factory = this._defaultFactory;
      let entity: IEntity;

      // custom factory ?
      if (Array.isArray(entityToAdd)) {
        entity = entityToAdd[0];
        if (entityToAdd[1] instanceof Factory) {
          factory = entityToAdd[1];
        } else {
          factory = new (entityToAdd[1])();
        }
      } else {
        entity = entityToAdd;
      }

      if (this._entities[entity.name] != null) {
        console.warn('[Store] Tried to add duplicated entity with name ', entity.name);
        continue;
      }

      let createdEntity = new StoredEntity(entity, this, factory);

      // Allow factory to manipulate entity
      let hydratedEntity = factory.hydrateEntity(createdEntity);

      if (hydratedEntity instanceof Error) {
        console.error(
          'Failed to hydrate entity ', createdEntity.name,
          '\nFactory generated error ', hydratedEntity.message,
        );
        continue;
      }

      // Add model procedures into archive
      for (let procedureName in hydratedEntity.proceduresFor?.model ?? {}) {
        if (typeof hydratedEntity.proceduresFor.model[procedureName]! === "object") {
          factory.archive.addModelProcedure(
            hydratedEntity.proceduresFor.model[procedureName]! as IModelProcedure
          );
        }
      }

      // Add entity procedure into archive
      for (let procName in hydratedEntity.proceduresFor?.entity ?? {}) {
        if (typeof hydratedEntity.proceduresFor?.entity[procName]! === "object") {
          factory.archive.addEntityProcedure(
            hydratedEntity.proceduresFor?.entity[procName]! as IEntityProcedure
          );
        }
      }

      this._entities[entity.name] = hydratedEntity;
      continue;
    }
  }

  hasEntity(name: string): boolean {
    return this._entities[name] != null;
  }

  entity<T = unknown>(name: string): StoredEntity<T> {
    if (this._entities[name] == null) {
      throw new Error('Tried to reach unknown entity "' + name + '"! Was it added to the Store?');
    }
    return this._entities[name];
  }

  async applyRequestProxies(request: IModelProcedureRequest | IEntityProcedureRequest, context: any): MaybePromise<IModelProcedureRequest | IEntityProcedureRequest> {
    for (let proxy of this._procedureProxies) {

      if (proxy.proxies !== 'request') continue;

      const proxiesThisProcedure = Array.isArray(proxy.procedure)
        ? proxy.procedure.includes(request.procedure)
        : (proxy.procedure === request.procedure || proxy.procedure === ProcedureProxyWildcard);
      let newRequest: Maybe<IModelProcedureRequest | IEntityProcedureRequest>;

      // Applies to model ?
      if (
        implementsModelProcedureRequest(request)
        && proxy.appliesTo === 'model'
        && proxiesThisProcedure
      ) {
        newRequest = await proxy.apply(request, context);
      }

      // Applies to entity?
      if (
        implementsEntityProcedureRequest(request)
        && proxy.appliesTo === 'entity'
        && proxiesThisProcedure
      ) {
        newRequest = await proxy.apply(request, context);
      } else {
      }

      if (newRequest! !== undefined) {
        if (newRequest instanceof Error) return newRequest;
        request = newRequest;
      }

    }

    return request;
  }

  async applyResponseProxies(response: IModelProcedureResponse | IEntityProcedureResponse): MaybePromise<IModelProcedureResponse | IEntityProcedureResponse> {
    for (let proxy of this._procedureProxies) {

      if (proxy.proxies !== 'response') continue;

      const proxiesThisProcedure = Array.isArray(proxy.procedure)
        ? proxy.procedure.includes(response.procedure)
        : (proxy.procedure === response.procedure || proxy.procedure === ProcedureProxyWildcard);
      let newResponse: Maybe<IModelProcedureResponse | IEntityProcedureResponse>;

      // Applies to model ?
      if (
        implementsModelProcedureResponse(response)
        && proxy.appliesTo === 'model'
        && proxiesThisProcedure
      ) {
        newResponse = await proxy.apply(response);
      }

      // Applies to entity?
      if (
        implementsEntityProcedureResponse(response)
        && proxy.appliesTo === 'entity'
        && proxiesThisProcedure
      ) {
        newResponse = await proxy.apply(response);
      }

      if (newResponse! !== undefined) {
        if (newResponse instanceof Error) return newResponse;
        response = newResponse;
      }

    }

    return response;
  };

  async applyQueryProxies(queryReq: QueryRequest): MaybePromise<QueryRequest> {
    return queryReq;
  }

  allEntities() {
    return Object.entries(this._entities).map(([_, ent]) => ent);
  }
}

export type ClassOfFactory = new (...args: any[]) => Factory & Factory;

type CustomFactoryEntity = [entity: IEntity, factory: Factory | ClassOfFactory];