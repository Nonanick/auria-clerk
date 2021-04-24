import { MaybePromise } from '@error/MaybePromise';
import type { IEntity } from '@lib/entity/IEntity';
import type { IModel } from '@lib/model/IModel';
import type { IArchive } from '../IArchive';
import type { IArchiveResponse } from './response/IArchiveResponse';

export type IArchiveProcedure = (
  archive: IArchive,
  entity: IEntity,
  models: IModel[]
) => MaybePromise<IArchiveResponse>;
