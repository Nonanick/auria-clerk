import { MaybePromise } from '../../../../error/Maybe';
import { IEntityProcedure } from '../../../../procedure/entity/IEntityProcedure';
import { IEntityProcedureContext } from '../../../../procedure/entity/IEntityProcedureContext';
import { IEntityProcedureRequest } from '../../../../procedure/entity/IEntityProcedureRequest';
import { IArchive } from '../../../IArchive';
import { IMysqlEntityProcedureResponse } from './IMysqlEntityProcedureResponse';

export interface IMysqlEntityProcedure<Context extends IEntityProcedureContext = IEntityProcedureContext>
  extends IEntityProcedure<Context> {
  execute: (
    archive: IArchive,
    request: IEntityProcedureRequest<Context>
  ) => MaybePromise<IMysqlEntityProcedureResponse>;
}