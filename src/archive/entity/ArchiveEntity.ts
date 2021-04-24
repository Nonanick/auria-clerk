import { MaybePromise } from '@error/MaybePromise';
import { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import { IQueryRequest } from '@lib/archive/query/IQueryRequest';
import { IQueryResponse } from '@lib/archive/query/IQueryResponse';
import { Entity } from 'src/lib/entity/Entity';

export class ArchiveEntity extends Entity implements IArchiveEntity {

  model(): IArchiveModel {
    throw new Error('Method not implemented.');
  }

  query(req : IQueryRequest) : MaybePromise<IQueryResponse> {
    throw new Error('Method not implemented.');
  }

}