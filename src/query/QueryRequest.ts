import { Entity } from "../entity/Entity";
import { IFilterQuery, implementsFilterComparison } from "./filter/IFilterQuery";
import { IQueryRequest } from "./IQueryRequest";
import { ILimitQuery } from "./limit/ILimitQuery";
import { IOrderBy } from "./order/IOrderBy";
import { FilterComparison } from './filter/FilterComparison';
import { MaybePromise } from '../error/Maybe';
import { ModelOf } from '../model/ModelOf';

export class QueryRequest<T = {}> {

  static MAX_ROWS_PER_QUERY = 1000;

  protected _entity: Entity;

  protected _properties?: string[] = [];

  protected _filters: IFilterQuery = {};

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

  set filters(filters: IFilterQuery) {
    this._filters = filters;
  }

  addFilter(filterName: string, filter: IFilterQuery | FilterComparison | FilterComparison[]) {
    if (
      implementsFilterComparison(filter)
      || Array.isArray(filter)
    ) {
      this._filters[filterName] = {
        ['filter-' + filterName]: filter
      };
      return this;
    }

    this._filters[filterName] = filter;
    return this;
  }

  get limit(): ILimitQuery {
    return this._limit ?? { amount: -1 };
  }

  set limit(limit: ILimitQuery) {
    this._limit = limit;
  }

  removeLimit() {
    this._limit = { amount: -1 };
    return this;
  }

  get ordering(): IOrderBy[] {
    return this._ordering;
  }

  set ordering(order: IOrderBy[]) {
    this._ordering = order;
  }

  addOrderBy(...order: IOrderBy[]) {
    this._ordering = [...this._ordering, ...order];
    return this;
  }

  removeOrderBy() {
    this._ordering = [];
  }

  lockedFilter(filters: { [name: string]: IFilterQuery; }) {
    this._lockedFilters = { ...this._lockedFilters, ...filters };
    return this;
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

  loadQueryRequest(request: Omit<IQueryRequest, "entity">) {

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

    return this;

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

  addProperties(...property: string[]) {
    this._properties = [...this._properties ?? [], ...property];
    return this;
  }

  async fetch(): MaybePromise<ModelOf<T>[]> {

    let response = await this._entity.archive.query(this);

    if (response instanceof Error) {
      return response;
    }

    return await response.rowsAsModels(this._entity);
  }

  // Ignores limiter
  async fetchOne(): MaybePromise<ModelOf<T> | undefined> {
    this.limit = {
      amount: 1,
      offset: 0
    };
    let response = await this._entity.archive.query(this);

    if (response instanceof Error) {
      return response;
    }

    let models = await response.rowsAsModels(this._entity);

    return models[0];
  }
}
