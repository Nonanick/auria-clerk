import { Maybe, MaybePromise } from '../error/Maybe';
import { Model } from "../model/Model";
import { EntityProcedureRequest } from "../procedure/entity/EntityProcedureRequest";
import { IEntityProcedureContext } from "../procedure/entity/IEntityProcedureContext";
import { IProperty, IPropertyIdentifier } from "../property/IProperty";
import { Property } from '../property/Property';
import { IFilterQuery } from "../query/filter/IFilterQuery";
import { IOrderBy } from "../query/order/IOrderBy";
import { QueryRequest } from "../query/QueryRequest";
import { Factory } from "./Factory";
import { IEntity } from "./IEntity";

export class Entity {

  protected _factory: Factory;

  protected _entity: IEntity;

  protected _properties: {
    [name: string]: Property;
  } = {};

  get name(): string {
    return this._entity.name;
  }

  get filters(): { [name: string]: IFilterQuery; } {
    return this._entity.filters ?? {};
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

    let idProp = new Property(init.identifier ?? this._factory.defaultIdentifier);
    this._properties[idProp.name] = idProp;

    for (let propName in this._entity.properties) {
      let newProp = new Property(
        {
          name: propName,
          ...this._entity.properties[propName]
        }
      );
      this._properties[newProp.name] = newProp;
    }
  }

  query(): QueryRequest {
    let query = new QueryRequest(this);
    return query;
  }

  execute(
    procedure: string,
    context?: IEntityProcedureContext
  ): EntityProcedureRequest {
    return new EntityProcedureRequest();
  }

  model(): Model {
    let model = new Model(this);

    // push procedures, proxies and hooks

    return model;
  }

  // Apply all validations to model
  async validate(model: Model): MaybePromise<true> {

    for (let validationName in this._entity.validate ?? {}) {
      let validation = this._entity.validate![validationName];
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

}