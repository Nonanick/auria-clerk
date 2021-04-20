import { Model } from '../../model/Model';
import { StoredModel } from '../../model/StoredModel';
import { IModelProcedureRequest } from "./IModelProcedureRequest";

export interface IModelProcedureResponse {
  procedure: string;
  request: IModelProcedureRequest;
  model: StoredModel;
  success: boolean;
  errors?: string | string[];
}

export function implementsModelProcedureResponse(obj: any): obj is IModelProcedureResponse {
  if (obj == null) return false;
  return (
    typeof obj.procedure === 'string'
    && obj.model instanceof Model
    && typeof obj.success === 'boolean'
    && typeof obj.request === 'object'
  );
}