import { IProxyEntityProcedureRequest } from "../procedure/entity/proxy/IProxyEntityProcedureRequest";
import { IProxyEntityProcedureResponse } from "../procedure/entity/proxy/IProxyEntityProcedureResponse";
import { IProxyModelProcedureRequest } from "../procedure/model/proxy/IProxyModelProcedureRequest";
import { IProxyModelProcedureResponse } from "../procedure/model/proxy/IProxyModelProcedureResponse";
import { IEntity } from "./IEntity";

export const MODEL_PROCEDURE_REQUEST_PROXY = 'model.procedure.request';
export const MODEL_PROCEDURE_RESPONSE_PROXY = 'model.procedure.response';
export const ENTITY_PROCEDURE_REQUEST_PROXY = 'entity.procedure.request';
export const ENTITY_PROCEDURE_RESPONSE_PROXY = 'entity.procedure.response';

function ProxyEntity(
  entity: IEntity,
  target: typeof MODEL_PROCEDURE_REQUEST_PROXY,
  proxy: {
    [procedureName: string]: IProxyModelProcedureRequest | IProxyModelProcedureRequest[];
  }
): IEntity;
function ProxyEntity(
  entity: IEntity,
  target: typeof MODEL_PROCEDURE_RESPONSE_PROXY,
  proxy: {
    [procedureName: string]: IProxyModelProcedureResponse | IProxyModelProcedureResponse[];
  }
): IEntity;
function ProxyEntity(
  entity: IEntity,
  target: typeof ENTITY_PROCEDURE_REQUEST_PROXY,
  proxy: {
    [procedureName: string]: IProxyEntityProcedureRequest | IProxyEntityProcedureRequest[];
  }
): IEntity;
function ProxyEntity(
  entity: IEntity,
  target: typeof ENTITY_PROCEDURE_RESPONSE_PROXY,
  proxy: {
    [procedureName: string]: IProxyEntityProcedureResponse | IProxyEntityProcedureResponse[];
  }
): IEntity;
function ProxyEntity(
  entity: IEntity,
  target:
    typeof ENTITY_PROCEDURE_REQUEST_PROXY
    | typeof ENTITY_PROCEDURE_RESPONSE_PROXY
    | typeof MODEL_PROCEDURE_REQUEST_PROXY
    | typeof MODEL_PROCEDURE_RESPONSE_PROXY,
  proxy: {
    [procedureName: string]: IProxyModelProcedureRequest | IProxyModelProcedureRequest[];
  }
): IEntity {

  switch (target) {
    case ENTITY_PROCEDURE_REQUEST_PROXY:
      break;
    case ENTITY_PROCEDURE_RESPONSE_PROXY:
      break;
    case MODEL_PROCEDURE_REQUEST_PROXY:
      break;
    case MODEL_PROCEDURE_RESPONSE_PROXY:
      break;
  }

  return entity;
}



export { ProxyEntity };