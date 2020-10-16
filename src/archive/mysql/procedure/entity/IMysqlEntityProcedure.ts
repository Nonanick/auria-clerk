import { MaybePromise } from '../../../../error/Maybe';
import { IEntityProcedure } from '../../../../procedure/entity/IEntityProcedure';
import { IEntityProcedureRequest } from '../../../../procedure/entity/IEntityProcedureRequest';
import { MysqlArchive } from '../../MysqlArchive';
import { MysqlArchiveTransaction } from '../../transaction/MysqlArchiveTransaction';
import { IMysqlEntityProcedureResponse } from './IMysqlEntityProcedureResponse';

export interface IMysqlEntityProcedure extends IEntityProcedure {
  execute: (
    this: MysqlArchive | MysqlArchiveTransaction,
    request: IEntityProcedureRequest
  ) => MaybePromise<IMysqlEntityProcedureResponse>;
}