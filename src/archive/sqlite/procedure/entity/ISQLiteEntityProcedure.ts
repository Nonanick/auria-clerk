import { MaybePromise } from '../../../../error/Maybe';
import { IEntityProcedure } from '../../../../procedure/entity/IEntityProcedure';
import { IEntityProcedureRequest } from '../../../../procedure/entity/IEntityProcedureRequest';
import { SQLiteArchive } from '../../SQLiteArchive';
import { SQLiteArchiveTransaction } from '../../transaction/SQLiteArchiveTransaction';
import { ISQLiteEntityProcedureResponse } from './ISQLiteEntityProcedureResponse';

export interface ISQLiteEntityProcedure extends IEntityProcedure {
  execute: (
    this: SQLiteArchive | SQLiteArchiveTransaction,
    request: IEntityProcedureRequest
  ) => MaybePromise<ISQLiteEntityProcedureResponse>;
}