import type { IEntity } from '@lib/entity/IEntity';
import type { IQueryAggregation } from './aggregation/IQueryAggregation';
import type { IQueryFilter } from './filter/IQueryFilter';
import type { IQueryJoin } from './join/IQueryJoin';
import type { IQueryLimit } from './limit/IQueryLimit';
import type { IQueryOrder } from './order/IQueryOrder';

export interface IQueryRequest {
  entity : string | IEntity;
  properties?: '*' | string[];
  filters?: {
    [name : string] : IQueryFilter;
  };
  order? : IQueryOrder[];
  limit? : IQueryLimit;
  aggregate? : IQueryAggregation[];
  join?: {
    [alias : string] : IQueryJoin;
  };
}