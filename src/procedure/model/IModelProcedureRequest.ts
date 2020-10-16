import { IEntity } from "../../entity/IEntity";
import { Model } from '../../model/Model';
import { IModelProcedure } from "./IModelProcedure";

export interface IModelProcedureRequest {
  procedure: string | IModelProcedure;
  entity: IEntity;
  model: Model;
}