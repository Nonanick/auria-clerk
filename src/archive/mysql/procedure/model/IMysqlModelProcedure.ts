import { MaybePromise } from '../../../../error/Maybe';
import { IModelProcedure } from '../../../../procedure/model/IModelProcedure';
import { IModelProcedureRequest } from '../../../../procedure/model/IModelProcedureRequest';
import { MysqlArchive } from '../../MysqlArchive';
import { MysqlArchiveTransaction } from '../../transaction/MysqlArchiveTransaction';
import { IMysqlModelProcedureResponse } from './IMysqlModelProcedureResponse';

export interface IMysqlModelProcedure extends IModelProcedure {
  execute: (
    this: MysqlArchive | MysqlArchiveTransaction,
    request: IModelProcedureRequest
  ) => MaybePromise<IMysqlModelProcedureResponse>;
}