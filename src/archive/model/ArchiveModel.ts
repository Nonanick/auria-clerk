import type { JsonObject, JsonValue } from 'type-fest';
import { MaybePromise } from '../../error/MaybePromise';
import { IArchive } from '../../interfaces/archive/IArchive';
import { IArchiveModel } from '../../interfaces/archive/model/IArchiveModel';
import { IEntity } from '../../interfaces/entity/IEntity';
import { Model } from '../../lib/model/Model';
import { ArchiveEntity } from '../entity/ArchiveEntity';

export class ArchiveModel<
Type extends JsonObject = JsonObject,
> extends Model<Type> implements IArchiveModel<Type> {

  static async fromId<T extends {} = JsonObject>(archive: IArchive, entity : IEntity<{}>, id : JsonValue) : MaybePromise<IArchiveModel<T>> {
    const ent = ArchiveEntity.from(archive, entity);
    const model = await ent.query({
      entity,
      filters : {
        'by-id' : [ent.identifier.name , '=', id]
      }
    });

    return model instanceof Error ? model : model.asModels()[0] as IArchiveModel<T>;

  }
}