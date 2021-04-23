import { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import { IArchive } from '@lib/archive/IArchive';
import { Factory } from './Factory';

export class DefaultFactory extends Factory {

  #archive : IArchive;

  get archive() {
    return this.#archive;
  }

  hydrate(entity: IArchiveEntity): Promise<IArchiveEntity> {
    throw new Error('Method not implemented.');
  }

  constructor(archive : IArchive) {
    super();
    this.#archive = archive;
  }

}