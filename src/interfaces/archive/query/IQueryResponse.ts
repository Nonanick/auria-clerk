import { Collection } from '../../../collection/Collection';
import { IModel } from '../../model/IModel';
import type { IQueryRequest } from './IQueryRequest';

export interface IQueryResponse {
  request : IQueryRequest;
  length : number;
  rows : any[];
  
  [Symbol.iterator] : Iterable<IModel>;

  asModels() : IModel[];
  asCollection() : Collection;
}
