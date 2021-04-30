import { IQueryFilter } from '@interfaces/archive/query/filter/IQueryFilter';
import { IValidateModel } from '@interfaces/model/validation/IValidateModel';
import type { IProperty } from '@interfaces/property/IProperty';
import type { Except, JsonObject } from 'type-fest';

export interface IEntity<T extends {} = JsonObject> {
  name : string;

  identifier? : IProperty;

  properties : Record<keyof T, Except<IProperty,"name">>;
  
  validations?: Record<string, IValidateModel>;

  defaultFilters?: Record<string, IQueryFilter>;

}