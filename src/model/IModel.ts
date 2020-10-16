import { IEntity } from "../entity/IEntity";
import { IModelProcedure } from "../procedure/model/IModelProcedure";

export interface IModel {
  entity: IEntity;
  procedures?: {
    [name: string]: IModelProcedure;
  };
}