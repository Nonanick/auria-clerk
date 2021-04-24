import type { IModel } from '@lib/model/IModel';
import { Collection } from '../../../collection/Collection';
import type { IQueryRequest } from './IQueryRequest';

export interface IQueryResponse {
  request : IQueryRequest;
  length : number;
  rows : any[];
  
  [Symbol.iterator] : Iterable<IModel>;

  asModels() : IModel[];
  asCollection() : Collection;
}
