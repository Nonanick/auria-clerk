import { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import { IFactory } from '@lib/archive/factory/IFactory';
import { IArchive } from '@lib/archive/IArchive';

export abstract class Factory implements IFactory {

  abstract get archive() : IArchive;

  abstract hydrate(entity: IArchiveEntity): Promise<IArchiveEntity>;
  
}