import { ArchiveModelOf } from '../model/ArchiveModelOf';
import { IArchiveEntity } from './IArchiveEntity';

export interface ArchiveEntityOf<T extends {}> extends IArchiveEntity<T> {

  model(): ArchiveModelOf<T>;

}
