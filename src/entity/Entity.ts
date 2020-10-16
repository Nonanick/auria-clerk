import { Model } from "../model/Model";
import { EntityProcedureRequest } from "../procedure/entity/EntityProcedureRequest";
import { IEntityProcedureContext } from "../procedure/entity/IEntityProcedureContext";
import { IProperty, IPropertyIdentifier } from "../property/IProperty";
import { IFilterQuery } from "../query/filter/IFilterQuery";
import { IOrderBy } from "../query/order/IOrderBy";
import { QueryRequest } from "../query/QueryRequest";
import { Factory } from "./Factory";
import { IEntity } from "./IEntity";

export class Entity {

  protected _factory: Factory;

  protected _entity: IEntity;

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

  get properties(): { [name: string]: Omit<IProperty, "name">; } {

    let identifier = this.identifier;

    return {
      ...this._entity.properties,
      [identifier.name]: identifier
    };
  }

  constructor(init: IEntity, factory: Factory) {
    this._entity = init;
    this._factory = factory;
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

}