import type { IEntity } from '@lib/entity/IEntity';
import type { IModel } from '@lib/model/IModel';
import type { IArchive } from '../IArchive';
import type { IArchiveProcedureResponse } from './IArchiveProcedureResponse';

export type IArchiveProcedure = (
  archive: IArchive,
  entity: IEntity,
  models: IModel[]
) => IArchiveProcedureResponse;
