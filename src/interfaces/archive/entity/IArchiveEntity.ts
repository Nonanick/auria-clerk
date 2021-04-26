import type { MaybePromise } from '@error/MaybePromise';
import type { IEntity } from '@lib/entity/IEntity';
import { JsonObject } from 'type-fest';
import type { IArchiveModel } from '../model/IArchiveModel';
import type { IQueryRequest } from '../query/IQueryRequest';
import type { IQueryResponse } from '../query/IQueryResponse';

export interface IArchiveEntity<
  T extends JsonObject = JsonObject,
  > extends IEntity {

  model(): IArchiveModel<T>;

  query(request: IQueryRequest): MaybePromise<IQueryResponse>;

  procedures(): string[];

}