import type { MaybePromise } from '@error/MaybePromise';
import type { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import type { IArchive } from '@lib/archive/IArchive';
import type { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import type { IQueryRequest } from '@lib/archive/query/IQueryRequest';
import type { IQueryResponse } from '@lib/archive/query/IQueryResponse';
import { IEntity } from '@lib/entity/IEntity';
import type { JsonObject } from 'type-fest';
import { Entity } from '../../lib/entity/Entity';

export class ArchiveEntity<
  Type extends JsonObject = JsonObject,
  Procedures extends string[] = string[]
> extends Entity<Type> implements IArchiveEntity {

  #archive : IArchive;

  archive() : IArchive {
    return this.#archive;
  }

  model(): IArchiveModel<Type> {
    throw new Error('Method not implemented.');
  }

  query(req : IQueryRequest) : MaybePromise<IQueryResponse> {
    throw new Error('Method not implemented.');
  }

  procedures() {
    return [];
  }

  constructor(archive : IArchive, entity : IEntity) {
    super(entity);
    this.#archive = archive;
  }

}