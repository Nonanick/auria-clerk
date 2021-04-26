import type { MaybePromise } from '@error/MaybePromise';
import type { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import type { IArchive } from '@lib/archive/IArchive';
import type { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import type { IQueryRequest } from '@lib/archive/query/IQueryRequest';
import type { IQueryResponse } from '@lib/archive/query/IQueryResponse';
import type { IEntity } from '@lib/entity/IEntity';
import type { JsonObject } from 'type-fest';
import { Entity } from '../../lib/entity/Entity';
import { ArchiveModel } from '../model/ArchiveModel';

export class ArchiveEntity<
  Type extends JsonObject = JsonObject,
  > extends Entity<Type> implements IArchiveEntity<Type> {

  #archive: IArchive;

  archive(): IArchive {
    return this.#archive;
  }

  model(): IArchiveModel<Type> {
    // Apply modification from super class
    const model = super.model(
      new ArchiveModel<Type>(this)
    );

    // Add entity procedures to model
    this.procedures().forEach(procedure => {
      (model as any)[procedure] = async () => {
        return (this as any)[procedure]([model]);
      };
    });

    return model;

  }

  query(req: IQueryRequest): MaybePromise<IQueryResponse> {
    throw new Error('Method not implemented.');
  }

  procedures() {
    return [];
  }

  constructor(archive: IArchive, entity: IEntity) {
    super(entity);
    this.#archive = archive;
  }

}