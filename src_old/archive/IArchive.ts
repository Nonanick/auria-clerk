import { MaybePromise } from '../error/Maybe';
import { IEntityProcedure } from '../procedure/entity/IEntityProcedure';
import { IEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedure } from '../procedure/model/IModelProcedure';
import { IModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { QueryRequest } from '../query/QueryRequest';
import { QueryResponse } from '../query/QueryResponse';
import { ArchiveProcedureHook } from './ArchiveProcedureHook';
import { ArchiveProcedureProxy } from './ArchiveProcedureProxy';

export interface IArchive {

  addModelProcedure(...procedures: IModelProcedure[]): void;
  addEntityProcedure(...procedures: IEntityProcedure[]): void;

  addProxy(...proxy: ArchiveProcedureProxy[]): void;
  removeProxy(...proxy: ArchiveProcedureProxy[]): void;

  addHook(...hook: ArchiveProcedureHook[]): void;
  removeHook(...hook: ArchiveProcedureHook[]): void;

  resolveRequest(procedureRequest: IModelProcedureRequest, context: any): MaybePromise<IModelProcedureResponse>;
  resolveRequest(procedureRequest: IEntityProcedureRequest, context: any): MaybePromise<IEntityProcedureResponse>;

  proxyProcedureRequest(req: IModelProcedureRequest, context: any): MaybePromise<IModelProcedureRequest>;
  proxyProcedureRequest(req: IEntityProcedureRequest, context: any): MaybePromise<IEntityProcedureRequest>;

  proxyProcedureResponse(res: IModelProcedureResponse): MaybePromise<IModelProcedureResponse>;
  proxyProcedureResponse(res: IEntityProcedureResponse): MaybePromise<IEntityProcedureResponse>;

  query<T = unknown>(queryRequest: QueryRequest<T>): MaybePromise<QueryResponse<T>>;

}