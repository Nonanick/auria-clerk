import { ArchiveProcedureHook } from '../archive/ArchiveProcedureHook';
import { ArchiveProcedureProxy } from '../archive/ArchiveProcedureProxy';
import { Entity, ProcedureProxyWildcard } from "../entity/Entity";
import { Factory } from "../entity/Factory";
import { IEntity } from "../entity/IEntity";
import { AppException } from "../error/AppException";
import { MaybePromise } from '../error/Maybe';
import { IHookProcedure } from '../hook/IHookProcedure';
import { Model } from '../model/Model';
import { IEntityProcedureRequest, implementsEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedureRequest, implementsModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { implementsProxyProcedure } from '../proxy/IProxyProcedure';
import { implementsProxyQuery, IProxyQuery } from '../proxy/IProxyQuery';
import { IQueryRequest } from '../query/IQueryRequest';
import { QueryRequest } from "../query/QueryRequest";

export class Store {

  protected _entities: {
    [name: string]: Entity;
  } = {};

  protected _defaultFactory: Factory;

  protected _queryProxies: IProxyQuery[] = [];

  protected _modelProcedureProxies: ArchiveProcedureProxy[] = [];
  protected _entityProcedureProxies: ArchiveProcedureProxy[] = [];

  protected _procedureHooks: IHookProcedure[] = [];

  constructor(defaultFactory: Factory | ClassOfFactory) {

    if (defaultFactory instanceof Factory) {
      this._defaultFactory = defaultFactory;
    } else {
      this._defaultFactory = new defaultFactory();
    }

  }

  query<T = {}>(entity: string, request?: Omit<IQueryRequest, "entity">): QueryRequest<T> {

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
        if (implementsModelProcedureRequest(proxy)) {
          this._modelProcedureProxies;
        }
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
    this._procedureHooks = this._procedureHooks;
  }

  async execute(on: Model, procedure: string, context: any): MaybePromise<IModelProcedureResponse>;
  async execute(on: Entity, procedure: string, context: any): MaybePromise<IEntityProcedureResponse>;
  async execute(
    on: Model | Entity,
    procedure: string,
    context: any
  ): MaybePromise<IEntityProcedureResponse | IModelProcedureResponse> {


    throw new Error('Not implemented!');
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
        console.warn('Tried to add duplicated entity with name ', entity.name);
        continue;
      }

      let createdEntity = new Entity(entity, this._defaultFactory);

      // Inject store high order fn
      createdEntity.query = (request: Omit<IQueryRequest, "entity">) => {
        return this.query(entity.name, request);
      };

      //
      createdEntity.execute = async (procedure: string, context: any) => {
        return this.execute(createdEntity, procedure, context);
      };

      createdEntity.executeOnModel = async (model: Model, procedure: string, context?: any) => {
        return this.execute(model, procedure, context ?? {});
      };

      let hydratedEntity = factory.hydrateEntity(createdEntity);

      if (hydratedEntity instanceof Error) {
        console.error(
          'Failed to hydrate entity ', createdEntity.name,
          '\nFactory generated error ', hydratedEntity.message,
        );
        continue;
      }

      this._entities[entity.name] = hydratedEntity;
      continue;
    }
  }

  entity(name: string): Entity | undefined {
    return this._entities[name];
  }

  async applyRequestProxies(request: IModelProcedureRequest | IEntityProcedureRequest): MaybePromise<IModelProcedureRequest | IEntityProcedureRequest> {

    for (let proxy of this._procedureProxies) {
      if (proxy.proxies !== 'request') continue;

      const proxiesThisProcedure = Array.isArray(proxy.procedure)
        ? proxy.procedure.includes(request.procedure)
        : (proxy.procedure === request.procedure || proxy.procedure === ProcedureProxyWildcard);

      // Applies to model ?
      if (
        implementsModelProcedureRequest(request)
        && proxy.appliesTo === 'model'
        && proxiesThisProcedure
      ) {

      }

      if (
        implementsEntityProcedureRequest(request)
        && proxy.appliesTo === 'entity'
        && proxiesThisProcedure
      ) {

      }

    }
    return request;
  }

  async applyResponseProxies(response: IModelProcedureResponse | IEntityProcedureResponse): MaybePromise<IModelProcedureResponse | IEntityProcedureResponse> {
    return response;
  };

  async applyQueryProxies(queryReq: QueryRequest): MaybePromise<QueryRequest> {
    return queryReq;
  }
}

type ClassOfFactory = new (...args: any[]) => Factory & Factory;

type CustomFactoryEntity = [entity: IEntity, factory: Factory | ClassOfFactory];