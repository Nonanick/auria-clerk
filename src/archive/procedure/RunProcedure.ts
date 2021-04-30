import type { Maybe } from '@error/Maybe';
import { ProcedureRequestProxyFailed } from '@error/procedure/ProcedureRequestProxyFailed';
import { ProcedureResponseProxyFailed } from '@error/procedure/ProcedureResponseProxyFailed';
import type { IArchiveEntity } from '@interfaces/archive/entity/IArchiveEntity';
import type { IArchive } from '@interfaces/archive/IArchive';
import type { IArchiveProcedure } from '@interfaces/archive/procedure/IArchiveProcedure';
import type { IArchiveRequest } from '@interfaces/archive/procedure/request/IArchiveRequest';
import type { IArchiveResponse } from '@interfaces/archive/procedure/response/IArchiveResponse';
import type { IModel } from '@interfaces/model/IModel';

/**
 * Run Procedure
 * -----------------
 * 
 * Execute a procedure based on a entity
 * 
 * Also applies proxies to the request and response flow
 * 
 * @param procedureName
 * @param procedure 
 * @param archive 
 * @param entity 
 * @param models 
 * @param context
 */
export async function RunProcedure(
  procedureName: string | Symbol,
  procedure: IArchiveProcedure,
  archive: IArchive,
  entity: IArchiveEntity,
  models: IModel[],
  context?: any
): Promise<IArchiveResponse> {

  let procedureRequest: IArchiveRequest = {
    archive, context, entity, models
  };
  // Apply Entity request proxies
  const allEntityRequestProxies = entity.getRequestProxies(procedureName);
  for (let proxy of allEntityRequestProxies) {
    let maybeRequest = await proxy.proxyFn(procedureRequest);
    if (maybeRequest instanceof Error) {
      return {
        ok: false,
        errors: [
          new ProcedureRequestProxyFailed(
            proxy,
            procedureName,
            procedure,
            procedureRequest
          ),
          maybeRequest,
        ],
        request: procedureRequest,
      };
    }
    procedureRequest = maybeRequest;
  }
  // Apply Archive request proxies
  const allArchiveRequestProxies = archive.getRequestProxies(procedureName);
  for (let proxy of allArchiveRequestProxies) {
    let maybeRequest = await proxy.proxyFn(procedureRequest);
    if (maybeRequest instanceof Error) {
      return {
        ok: false,
        errors: [
          new ProcedureRequestProxyFailed(
            proxy,
            procedureName,
            procedure,
            procedureRequest
          ),
          maybeRequest,
        ],
        request: procedureRequest,
      };
    }
    procedureRequest = maybeRequest;
  }
  // Resolve procedure
  let maybeProcedureResponse: Maybe<IArchiveResponse>;
  let procedureResponse: IArchiveResponse;

  try {
    maybeProcedureResponse = await procedure(archive, entity, models);
    if (maybeProcedureResponse instanceof Error) {
      procedureResponse = {
        ok: false,
        errors: [maybeProcedureResponse],
        request: procedureRequest
      };
    } else {
      procedureResponse = maybeProcedureResponse;
    }
  } catch (err) {
    procedureResponse = {
      ok: false,
      errors: [err],
      request: procedureRequest
    };
  }

  // Apply Archive response proxies
  const allArchiveResponseProxies = archive.getResponseProxies(procedureName);
  for (let proxy of allArchiveResponseProxies) {
    let maybeResponse = await proxy.proxyFn(procedureResponse);
    if (maybeResponse instanceof Error) {
      return {
        ok: false,
        errors: [
          new ProcedureResponseProxyFailed(
            proxy,
            procedureName,
            procedure,
            procedureResponse,
            procedureRequest
          ),
          maybeResponse,
        ],
        request: procedureRequest,
      };
    }
    procedureResponse = maybeResponse;
  }
  // Apply Entity response proxies
  const allEntityResponseProxies = entity.getResponseProxies(procedureName);
  for (let proxy of allEntityResponseProxies) {
    let maybeResponse = await proxy.proxyFn(procedureResponse);
    if (maybeResponse instanceof Error) {
      return {
        ok: false,
        errors: [
          new ProcedureResponseProxyFailed(
            proxy,
            procedureName,
            procedure,
            procedureResponse,
            procedureRequest
          ),
          maybeResponse,
        ],
        request: procedureRequest,
      };
    }
    procedureResponse = maybeResponse;
  }

  return procedureResponse;
}