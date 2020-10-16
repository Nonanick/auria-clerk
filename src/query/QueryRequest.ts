import { Entity } from "../entity/Entity";
import { IFilterQuery } from "./filter/IFilterQuery";
import { IQueryRequest } from "./IQueryRequest";
import { ILimitQuery } from "./limit/ILimitQuery";
import { IOrderBy } from "./order/IOrderBy";
import { Model } from '../model/Model';

export class QueryRequest {

  static MAX_ROWS_PER_QUERY = 1000;

  protected _entity: Entity;

  protected _properties?: string[] = [];

  protected _filters: { [name: string]: IFilterQuery; } = {};

  protected _lockedFilters: { [name: string]: IFilterQuery; } = {};

  protected _ordering: IOrderBy[] = [];

  protected _limit: ILimitQuery = {
    amount: QueryRequest.MAX_ROWS_PER_QUERY,
    offset: 0
  };

  get entity(): Entity {
    return this._entity;
  }

  get source(): string {
    return this._entity.source;
  }

  get filters() {
    return { ...this._filters, ...this._lockedFilters };
  }

  set filters(filters: { [name: string]: IFilterQuery; }) {
    this._filters = filters;
  }

  get limit(): ILimitQuery {
    return this._limit ?? { amount: -1 };
  }

  set limit(limit: ILimitQuery) {
    this._limit = limit;
  }

  removeLimit() {
    this._limit = { amount: -1 };
  }

  get ordering(): IOrderBy[] {
    return this._ordering;
  }

  set ordering(order: IOrderBy[]) {
    this._ordering = order;
  }

  addOrderBy(...order: IOrderBy[]) {
    this._ordering = [...this._ordering, ...order];
  }

  removeOrderBy() {
    this._ordering = [];
  }

  lockedFilter(filters: { [name: string]: IFilterQuery; }) {
    this._lockedFilters = { ...this._lockedFilters, ...filters };
  }

  constructor(queriedEntity: Entity) {
    this._entity = queriedEntity;

    // import filters to query
    if (queriedEntity.hasFilters()) {
      this.filters = queriedEntity.filters;
    }

    // import order to query
    if (queriedEntity.hasOrdering()) {
      this.ordering = [queriedEntity.orderBy!];
    }

  }

  loadQueryRequest(request: IQueryRequest) {

    // Properties
    this._properties = [...this.properties, ...request.properties ?? []];

    // Filters
    let requestFilters: {
      [name: string]: IFilterQuery;
    } = {};

    if (Array.isArray(request.filters)) {
      for (let a = 0; a < request.filters.length; a++) {
        requestFilters['request-filter-' + a] = request.filters[a];
      }
    } else {
      if (request.filters != null) {
        requestFilters['request-filter-0'] = request.filters;
      }
    }
    this.filters = {
      ...requestFilters,
      ...this.filters,
    };

    // Ordering
    if (request.order != null) {
      if (Array.isArray(request.order)) {
        this.ordering = [...this.ordering, ...request.order];
      } else {
        this.ordering = [...this.ordering, request.order];
      }
    }

    // Limit
    if (request.limit != null) {
      this.limit = request.limit;
    }


  }

  hasLimiter(): boolean {
    return this._limit.amount > 0;
  }

  hasFilter(): boolean {
    return Object.keys(this.filters).length > 0;
  }

  hasOrder(): boolean {
    return this._ordering.length > 0;
  }

  set properties(props: string[]) {
    this._properties = props;
  }

  get properties(): string[] {
    return this._properties ?? [];
  }

  async fetch(): Promise<Model[]> {
    return [];
  }

  // Ignores limiter
  async fetchOne(): Promise<Model | undefined> {
    return;
  }
}

function implementsQueryRequest(obj: any): obj is IQueryRequest {
  return (
    obj.entity != null
    && (typeof obj.entity === 'string' || typeof obj.entity === 'object')
  );
}