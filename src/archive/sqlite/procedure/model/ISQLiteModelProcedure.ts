import { MaybePromise } from '../../../../error/Maybe';
import { IModelProcedure } from '../../../../procedure/model/IModelProcedure';
import { IModelProcedureRequest } from '../../../../procedure/model/IModelProcedureRequest';
import { SQLiteArchive } from '../../SQLiteArchive';
import { SQLiteArchiveTransaction } from '../../transaction/SQLiteArchiveTransaction';
import { ISQLiteModelProcedureResponse } from './ISQLiteModelProcedureResponse';

export interface ISQLiteModelProcedure extends IModelProcedure {
  execute: (
    this: SQLiteArchive | SQLiteArchiveTransaction,
    request: IModelProcedureRequest
  ) => MaybePromise<ISQLiteModelProcedureResponse>;
}