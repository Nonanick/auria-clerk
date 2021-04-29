import { IQueryFilter } from '@lib/archive/query/filter/IQueryFilter';
import { IValidateModel } from '@lib/model/validation/IValidateModel';
import type { IProperty } from '@lib/property/IProperty';
import type { Except, JsonObject } from 'type-fest';

export interface IEntity<T = JsonObject> {
  name : string;

  properties : Record<keyof T, Except<IProperty,"name">>;
  
  validations?: Record<string, IValidateModel>;

  defaultFilters?: Record<string, IQueryFilter>;

}