import type { IModel } from '@lib/model/IModel';
import type { JsonObject } from 'type-fest';

export interface IArchiveModel<
T extends JsonObject = JsonObject, 
  > extends IModel<T> {
  
}