import { Model } from '../../model/Model';
import { IModelProcedureRequest } from "./IModelProcedureRequest";

export interface IModelProcedureResponse {
  request: IModelProcedureRequest;
  model: Model;
  success: boolean;
  errors?: string | string[];
}