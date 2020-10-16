import { IEntity } from "../../entity/IEntity";
import { IModelProcedureContext } from "../model/context/IModelProcedureContext";
import { IEntityProcedureContext } from "./IEntityProcedureContext";
import { IEntityProcedureResponse } from "./IEntityProcedureResponse";

export function ExecuteEntityProcedure<
  Context extends IEntityProcedureContext = IEntityProcedureContext,
  Response extends IEntityProcedureResponse = IEntityProcedureResponse
>(this: IEntity, procedure: string, context: IModelProcedureContext): IEntityProcedureResponse {
  return {

  };
}