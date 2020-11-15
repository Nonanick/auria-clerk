import { Entity } from "../entity/Entity";
import { Factory } from "../entity/Factory";
import { IEntity } from "../entity/IEntity";
import { AppException } from "../error/AppException";
import { EntityProcedureRequest } from "../procedure/entity/EntityProcedureRequest";
import { IQueryRequest } from '../query/IQueryRequest';
import { QueryRequest } from "../query/QueryRequest";

export class Store {

  protected _entities: {
    [name: string]: Entity;
  } = {};

  protected _defaultFactory: Factory;

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

  execute(
    procedure: string,
    on: Entity
  ): EntityProcedureRequest {

    let request = new EntityProcedureRequest();

    return request;
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

}

type ClassOfFactory = new (...args: any[]) => Factory & Factory;

type CustomFactoryEntity = [entity: IEntity, factory: Factory | ClassOfFactory];