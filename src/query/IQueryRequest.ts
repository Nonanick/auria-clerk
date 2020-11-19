import { IEntity } from "../entity/IEntity";
import { IFilterQuery } from "./filter/IFilterQuery";
import { ILimitQuery } from "./limit/ILimitQuery";
import { IOrderBy } from "./order/IOrderBy";

export interface IQueryRequest {
  entity: IEntity | string;
  properties?: string[];
  filters?: IFilterQuery | IFilterQuery[];
  order?: IOrderBy | IOrderBy[];
  limit?: ILimitQuery;
}
