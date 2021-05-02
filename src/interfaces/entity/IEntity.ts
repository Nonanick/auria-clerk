import { IQueryFilter } from '../archive/query/filter/IQueryFilter';
import { IValidateModel } from '../model/validation/IValidateModel';
import { IProperty } from '../property/IProperty';

export interface IEntity<T> {
  name: string;

  properties: Record<keyof T, IProperty>;

  identifier?: IProperty & { name: string };

  validations?: Record<string, IValidateModel>;

  defaultFilters?: Record<string, IQueryFilter>;

}