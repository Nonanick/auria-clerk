import type { MaybePromise } from '@error/MaybePromise';
import type { IEntity } from '@lib/entity/IEntity';
import type { IArchiveModel } from '../model/IArchiveModel';
import type { IQueryRequest } from '../query/IQueryRequest';
import type { IQueryResponse } from '../query/IQueryResponse';

export interface IArchiveEntity extends IEntity {

  model() : IArchiveModel;
  query(request : IQueryRequest) : MaybePromise<IQueryResponse>;

}