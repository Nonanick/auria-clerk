import { MaybePromise, Procedure } from '../AuriaClerk';
import { ProcedureProxyWildcard } from '../entity/Entity';
import { Maybe } from '../error/Maybe';
import { IEntityProcedure } from '../procedure/entity/IEntityProcedure';
import { implementsEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { implementsEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedure } from '../procedure/model/IModelProcedure';
import { implementsModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { implementsModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';
import { QueryRequest, QueryResponse } from '../query';
import { ArchiveProcedureHook } from './ArchiveProcedureHook';
import { ArchiveProcedureProxy } from './ArchiveProcedureProxy';
import { IArchive } from './IArchive';

type ModelRequest = Procedure.OfModel.IRequest;
type ModelResponse = Procedure.OfModel.IResponse;

type EntityRequest = Procedure.OfEntity.IRequest;
type EntityResponse = Procedure.OfEntity.IResponse;

export abstract class Archive implements IArchive {

  protected _modelProcedures: Set<IModelProcedure> = new Set();
  protected _entityProcedures: Set<IEntityProcedure> = new Set();

  addModelProcedure(...procedures: Procedure.OfModel.IProcedure[]): void {
    for (let procedure of procedures) {
      this._modelProcedures.add(procedure);
    }
  }

  addEntityProcedure(...procedures: Procedure.OfEntity.IProcedure[]): void {
    for (let procedure of procedures) {
      this._entityProcedures.add(procedure);
    }
  }

  async proxyProcedureRequest(req: ModelRequest, context: any): MaybePromise<ModelRequest>;
  async proxyProcedureRequest(req: EntityRequest, context: any): MaybePromise<EntityRequest>;
  async proxyProcedureRequest(req: ModelRequest | EntityRequest, context: any): MaybePromise<ModelRequest | EntityRequest> {

    const proxies = this._proxies;

    for (let proxy of proxies) {
      if (proxy.proxies !== "request") continue;

      const matchesRequestedProcedure = Array.isArray(proxy.procedure)
        ? proxy.procedure.includes(req.procedure)
        : (proxy.procedure === req.procedure || proxy.procedure === ProcedureProxyWildcard);

      // Applies to model?
      if (
        implementsModelProcedureRequest(req)
        && proxy.appliesTo === "model"
        && matchesRequestedProcedure
      ) {
        let proxiedRequest = await proxy.apply(req, context);
        if (proxiedRequest instanceof Error) {
          return proxiedRequest;
        }
        req = proxiedRequest;
        continue;
      }

      // Applies to entity?
      if (
        implementsEntityProcedureRequest(req)
        && proxy.appliesTo === "entity"
        && matchesRequestedProcedure
      ) {
        let proxiedRequest = await proxy.apply(req, context);
        if (proxiedRequest instanceof Error) {
          return proxiedRequest;
        }
        req = proxiedRequest;
        continue;
      }
    }

    return req;
  }

  async proxyProcedureResponse(res: ModelResponse): MaybePromise<ModelResponse>;
  async proxyProcedureResponse(res: EntityResponse): MaybePromise<EntityResponse>;
  async proxyProcedureResponse(res: EntityResponse | ModelResponse): MaybePromise<EntityResponse | ModelResponse> {
    const proxies = this._proxies;

    for (let proxy of proxies) {
      if (proxy.proxies !== "response") continue;

      const matchesRequestedProcedure = Array.isArray(proxy.procedure)
        ? proxy.procedure.includes(res.procedure)
        : (proxy.procedure === res.procedure || proxy.procedure === ProcedureProxyWildcard);

      // Applies to model?
      if (
        implementsModelProcedureResponse(res)
        && proxy.appliesTo === "model"
        && matchesRequestedProcedure
      ) {
        let proxiedRequest = await proxy.apply(res);
        if (proxiedRequest instanceof Error) {
          return proxiedRequest;
        }
        res = proxiedRequest;
        continue;
      }

      // Applies to entity?
      if (
        implementsEntityProcedureResponse(res)
        && proxy.appliesTo === "entity"
        && matchesRequestedProcedure
      ) {
        let proxiedRequest = await proxy.apply(res);
        if (proxiedRequest instanceof Error) {
          return proxiedRequest;
        }
        res = proxiedRequest;
        continue;
      }
    }

    return res;
  }

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

  async digestRequest(request: ModelRequest, context: any): MaybePromise<ModelResponse>;
  async digestRequest(request: EntityRequest, context: any): MaybePromise<EntityResponse>;
  async digestRequest(request: ModelRequest | EntityRequest, context: any): MaybePromise<ModelResponse | EntityResponse> {

    const maybeRequest = await this.proxyProcedureRequest(request as any, context);
    if (maybeRequest instanceof Error) {
      return maybeRequest;
    }
    const procedures = implementsEntityProcedureRequest(request)
      ? this._entityProcedures.values() : this._modelProcedures.values();


    let maybeResponse: Maybe<ModelResponse | EntityResponse>;
    let procedureExists = false;

    for (let procedure of procedures) {
      if (procedure.name === request.procedure) {
        procedureExists = true;
        maybeResponse = await procedure.execute(this, request as any, context);
        break;
      }
    }

    if (maybeResponse! == null && !procedureExists) {
      return new Error(
        "Empty response for request, make sure the requested procedure '" + request.procedure + "' exists in the archive!"
      );
    }

    if (maybeResponse! == null && procedureExists) {
      return new Error(
        "Empty response for request! Procedure '" + request.procedure + "' failed to generate a response!"
      );
    }

    if (maybeResponse! instanceof Error) {
      return maybeResponse;
    }

    const proxiedResponse = (await this.proxyProcedureResponse(maybeResponse! as any)) as Maybe<EntityResponse | ModelResponse>;

    return proxiedResponse!;

  }


  abstract async query<T = any>(queryRequest: QueryRequest<T>): MaybePromise<QueryResponse<T>>;

}