import { IQueryAggregation } from '../../../interfaces/archive/query/aggregation/IQueryAggregation';
import { IQueryFilter } from '../../../interfaces/archive/query/filter/IQueryFilter';
import { IQueryRequest } from '../../../interfaces/archive/query/IQueryRequest';
import { IQueryJoin } from '../../../interfaces/archive/query/join/IQueryJoin';
import { IQueryLimit } from '../../../interfaces/archive/query/limit/IQueryLimit';
import { IQueryOrder } from '../../../interfaces/archive/query/order/IQueryOrder';
import { IEntity } from '../../../interfaces/entity/IEntity';

export class QueryRequest implements IQueryRequest {
  properties?: '*' | string[] | undefined;
  filters?: { [name: string]: IQueryFilter; } | undefined;
  order?: IQueryOrder[] | undefined;
  limit?: IQueryLimit | undefined;
  aggregate?: IQueryAggregation[] | undefined;
  join?: { [alias: string]: IQueryJoin; } | undefined;

  constructor(public entity : string | IEntity<{}>) {}
}