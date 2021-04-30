import { IArchiveEntity } from '@interfaces/archive/entity/IArchiveEntity';
import { IFactory } from '@interfaces/archive/factory/IFactory';
import { IArchive } from '@interfaces/archive/IArchive';

export abstract class Factory implements IFactory {

  abstract get archive() : IArchive;

  abstract hydrate(entity: IArchiveEntity): Promise<IArchiveEntity>;
  
}