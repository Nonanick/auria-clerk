import { IModel } from "../../model/IModel";
import { IModelProcedureRequest } from "./IModelProcedureRequest";

export interface IModelProcedureResponse {
  request: IModelProcedureRequest;
  model: IModel;
  success: boolean;
}