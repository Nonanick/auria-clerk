import type { Except } from 'type-fest';
import { IQueryFilter } from '../archive/query/filter/IQueryFilter';
import { IValidateModel } from '../model/validation/IValidateModel';
import { IProperty } from '../property/IProperty';

export interface IEntity<T> {
  name : string;

  properties : Record<keyof T, Except<IProperty,"name">>;

  identifier? : IProperty;
  
  validations?: Record<string, IValidateModel>;

  defaultFilters?: Record<string, IQueryFilter>;

}