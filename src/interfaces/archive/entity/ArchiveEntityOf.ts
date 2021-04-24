import { JsonObject } from 'type-fest';
import { ArchiveModelOf } from '../model/ArchiveModelOf';
import { IArchiveEntity } from './IArchiveEntity';

export interface ArchiveEntityOf<T extends JsonObject> extends IArchiveEntity<T> {

  model(): ArchiveModelOf<T>;

}
