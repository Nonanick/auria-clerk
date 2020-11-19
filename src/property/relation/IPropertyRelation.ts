import { IEntity } from '../../entity/IEntity';
import { IFilterQuery, ILimitQuery, IOrderBy } from '../../query';

export interface IPropertyRelation {
  type: 'one-to-one' | 'one-to-many' | 'many-to-one';
  entity: IEntity | string;
  property: string;
  returning?: string[];
  filters?: IFilterQuery;
  limit?: ILimitQuery;
  order?: IOrderBy;
}