import { IEntity } from "../../entity/IEntity";
import { IModel } from "../../model/IModel";
import { IModelProcedure } from "./IModelProcedure";

export interface IModelProcedureRequest {
  procedure: string | IModelProcedure;
  entity: IEntity;
  model: IModel;
}