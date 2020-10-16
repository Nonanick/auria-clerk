import { MaybePromise } from '../../error/Maybe';
import { IModelProcedureContext } from "./context/IModelProcedureContext";
import { IModelProcedureRequest } from "./IModelProcedureRequest";
import { IModelProcedureResponse } from "./IModelProcedureResponse";

export interface IModelProcedure<
  Context extends IModelProcedureContext = IModelProcedureContext,
  Response extends IModelProcedureResponse = IModelProcedureResponse> {
  name: string;
  execute: ExecuteModelProcedureFunction<Context, Response>;
}

export type ExecuteModelProcedureFunction<
  Context extends IModelProcedureContext = IModelProcedureContext,
  Response extends IModelProcedureResponse = IModelProcedureResponse
  > = (
    request: IModelProcedureRequest,
    context: Context
  ) => MaybePromise<Response>;  