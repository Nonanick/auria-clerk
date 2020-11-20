import { IArchive } from '../../archive/IArchive';
import { MaybePromise } from '../../error/Maybe';
import { IModelProcedureRequest } from "./IModelProcedureRequest";
import { IModelProcedureResponse } from "./IModelProcedureResponse";

export interface IModelProcedure<Response extends IModelProcedureResponse = IModelProcedureResponse> {
  name: string;
  execute: ExecuteModelProcedureFunction<Response>;
}

export type ExecuteModelProcedureFunction<Response extends IModelProcedureResponse = IModelProcedureResponse
  > = (
    archive: IArchive,
    request: IModelProcedureRequest,
    context: any
  ) => MaybePromise<Response>;  