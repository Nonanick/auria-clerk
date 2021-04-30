import { MaybePromise } from '@error/MaybePromise';
import type { IEntity } from '@interfaces/entity/IEntity';
import type { IModel } from '@interfaces/model/IModel';
import type { IArchive } from '../IArchive';
import type { IArchiveResponse } from './response/IArchiveResponse';

export type IArchiveProcedure = (
  archive: IArchive,
  entity: IEntity,
  models: IModel[]
) => MaybePromise<IArchiveResponse>;
