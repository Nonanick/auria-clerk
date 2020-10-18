import { Entity } from '../../entity/Entity';
import { Model } from '../../model/Model';
import { IModelProcedure } from "./IModelProcedure";

export interface IModelProcedureRequest {
  procedure: string | IModelProcedure;
  entity: Entity;
  model: Model;
}