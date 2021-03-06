import { Except } from 'type-fest';
import { StoredEntity, StoredModelOf } from '../entity/StoredEntity';
import { MaybePromise } from '../error/Maybe';
import { FilterComparison } from './filter/FilterComparison';
import { IFilterQuery, implementsFilterComparison } from "./filter/IFilterQuery";
import { IQueryRequest } from "./IQueryRequest";
import { ILimitQuery } from "./limit/ILimitQuery";
import { IOrderBy } from "./order/IOrderBy";

export class QueryRequest<T = {}> {

  static MAX_ROWS_PER_QUERY = 1000;

  protected _entity: StoredEntity;

  protected _properties?: string[] = [];

  protected _filters: IFilterQuery = {};

  protected _lockedFilters: { [name: string]: IFilterQuery; } = {};

  protected _ordering: IOrderBy[] = [];

  protected _include: string[] = [];

  protected _limit: ILimitQuery = {
    amount: QueryRequest.MAX_ROWS_PER_QUERY,
    offset: 0
  };

  get entity(): StoredEntity {
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

  get includes() {
    return this._include;
  }

  set includes(includes: string[]) {
    if (!this.checkIncludes(includes)) {
      return;
    }
    this._include = includes;
  }

  protected checkIncludes(includes: string[]) {
    for (let include of includes) {
      let prop = this.entity.properties[include];
      if (prop == null || !prop?.hasRelation()) {
        console.warn('Included property "' + include + '" does not have a relation!');
        return false;
      }
    }
    return true;
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

  constructor(queriedEntity: StoredEntity) {

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

  loadQueryRequest(request: Except<IQueryRequest, "entity">) {

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

    // Includes 
    if (Array.isArray(request.include)) {
      this.include(...request.include);
    }

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

  hasIncludes(): boolean {
    return this._include.length > 0;
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

  include(...property: string[]) {
    if (!this.checkIncludes(property)) {
      console.error('[QueryRequest] Check included properties failed!');
      return false;
    }
    this._include = [...this._include ?? [], ...property];
    return true;
  }

  async fetch(raw = false): MaybePromise<StoredModelOf<T>[]> {

    let response = await this._entity.archive.query(this);

    if (response instanceof Error) {
      return response;
    }

    return raw
      ? response.rowsWithPublicProps(this._entity)
      : await response.rowsAsModels(this._entity);
  }

  // Ignores limiter
  async fetchOne(raw = false): MaybePromise<StoredModelOf<T> | undefined> {
    this.limit = {
      amount: 1,
      offset: 0
    };
    let response = await this._entity.archive.query(this);

    if (response instanceof Error) {
      return response;
    }

    let models = raw
      ? response.rowsWithPublicProps(this._entity)
      : await response.rowsAsModels(this._entity);

    return models[0];
  }


  async exists(): Promise<boolean> {
    this.limit = {
      amount: 1,
      offset: 0
    };

    let response = await this._entity.archive.query(this);

    if (response instanceof Error) {
      return false;
    }

    return response.rows().length > 0;
  }

}
