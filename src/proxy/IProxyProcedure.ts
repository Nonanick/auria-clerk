import { MaybePromise } from '../error/Maybe';
import { IEntityProcedureContext } from '../procedure/entity/IEntityProcedureContext';
import { IEntityProcedureRequest } from '../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedureContext } from '../procedure/model/context/IModelProcedureContext';
import { IModelProcedureRequest } from '../procedure/model/IModelProcedureRequest';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';

export type IProxyProcedure =
  | IProxyModelProcedureRequest
  | IProxyModelProcedureResponse
  | IProxyEntityProcedureRequest
  | IProxyEntityProcedureResponse;

interface IProxyProcedureBase {
  name: string;
  procedure: string | string[];
  appliesTo: 'model' | 'entity';
  proxies: 'request' | 'response';
}

export interface IProxyModelProcedureRequest extends IProxyProcedureBase {
  appliesTo: 'model';
  proxies: 'request';
  apply(
    request: IModelProcedureRequest,
    context: IModelProcedureContext
  ): MaybePromise<IModelProcedureRequest>;
}

export interface IProxyModelProcedureResponse extends IProxyProcedureBase {
  appliesTo: 'model';
  proxies: 'response';
  apply(response: IModelProcedureResponse): Promise<IModelProcedureResponse>;
}


export interface IProxyEntityProcedureRequest extends IProxyProcedureBase {
  appliesTo: 'entity';
  proxies: 'request';
  apply(
    request: IEntityProcedureRequest,
    context: IEntityProcedureContext
  ): MaybePromise<IEntityProcedureRequest>;
}

export interface IProxyEntityProcedureResponse extends IProxyProcedureBase {
  appliesTo: 'entity';
  proxies: 'response';
  apply(response: IEntityProcedureResponse): Promise<IEntityProcedureResponse>;
}

export function implementsProxyProcedure(obj: any): obj is IProxyProcedure {
  if (obj == null) {
    return false;
  }
  return (
    (typeof obj.procedure === 'string' || Array.isArray(obj.procedure))
    && (obj.appliesTo === 'model' || obj.appliesTo === 'entity')
    && (obj.proxies === 'request' || obj.proxies === 'response')
    && typeof obj.apply === 'function'
  );
}