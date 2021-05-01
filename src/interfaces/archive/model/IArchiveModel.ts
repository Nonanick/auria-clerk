import type { JsonObject } from 'type-fest';
import { IModel } from '../../model/IModel';

export interface IArchiveModel<
T extends {} = JsonObject, 
  > extends IModel<T> {
  
}