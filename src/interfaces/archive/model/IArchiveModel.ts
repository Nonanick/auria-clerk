import type { IModel } from '@interfaces/model/IModel';
import type { JsonObject } from 'type-fest';

export interface IArchiveModel<
T extends {} = JsonObject, 
  > extends IModel<T> {
  
}