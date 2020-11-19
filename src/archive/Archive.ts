import { MaybePromise, Procedure } from '../AuriaClerk';
import { QueryRequest, QueryResponse } from '../query';
import { ArchiveProcedureHook } from './ArchiveProcedureHook';
import { ArchiveProcedureProxy } from './ArchiveProcedureProxy';
import { IArchive } from './IArchive';

type ModelRequest = Procedure.OfModel.IRequest;
type ModelResponse = Procedure.OfModel.IResponse;

type EntityRequest = Procedure.OfEntity.IRequest;
type EntityResponse = Procedure.OfEntity.IResponse;

export abstract class Archive implements IArchive {

  protected _proxies: ArchiveProcedureProxy[] = [];

  protected _hooks: ArchiveProcedureHook[] = [];

  addProxy(...proxy: ArchiveProcedureProxy[]): void {
    this._proxies.push(...proxy);
  }

  removeProxy(...proxy: ArchiveProcedureProxy[]): void {
    this._proxies = this._proxies.filter(p => !proxy.includes(p));
  }

  addHook(...hook: ArchiveProcedureHook[]): void {
    this._hooks.push(...hook);
  }

  removeHook(...hook: ArchiveProcedureHook[]): void {
    this._hooks = this._hooks.filter(h => !hook.includes(h));
  }

  abstract async execute(procedureRequest: ModelRequest): MaybePromise<ModelResponse>;
  abstract async execute(procedureRequest: EntityRequest): MaybePromise<EntityResponse>;
  abstract async execute(procedureRequest: ModelRequest | EntityRequest): MaybePromise<ModelResponse | EntityResponse>;

  abstract async query<T = any>(queryRequest: QueryRequest<{}>): MaybePromise<QueryResponse<T>>;

}