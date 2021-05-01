import { MaybePromise } from '../../../error/MaybePromise';
import { IEntity } from '../../entity/IEntity';
import { IModel } from '../../model/IModel';
import type { IArchive } from '../IArchive';
import type { IArchiveResponse } from './response/IArchiveResponse';

export type IArchiveProcedure = (
  archive: IArchive,
  entity: IEntity<{}>,
  models: IModel[]
) => MaybePromise<IArchiveResponse>;
