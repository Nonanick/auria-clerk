import type { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import type { JsonObject } from 'type-fest';
import { Model } from '../../lib/model/Model';

export class ArchiveModel<
Type extends JsonObject = JsonObject,
> extends Model<Type> implements IArchiveModel<Type> {

}