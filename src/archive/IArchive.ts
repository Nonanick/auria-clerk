import { MaybePromise } from '../error/Maybe';
import { IEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { QueryRequest } from '../query/QueryRequest';
import { QueryResponse } from '../query/QueryResponse';
import { ArchiveProcedureHook } from './ArchiveProcedureHook';
import { ArchiveProcedureProxy } from './ArchiveProcedureProxy';

export interface IArchive {

  addProxy(...proxy: ArchiveProcedureProxy[]): void;
  removeProxy(...proxy: ArchiveProcedureProxy[]): void;

  addHook(...hook: ArchiveProcedureHook[]): void;
  removeHook(...hook: ArchiveProcedureHook[]): void;

  execute(procedureRequest: IModelProcedureRequest): MaybePromise<IModelProcedureResponse>;
  execute(procedureRequest: IEntityProcedureRequest): MaybePromise<IEntityProcedureResponse>;

  query(queryRequest: QueryRequest): MaybePromise<QueryResponse>;

}