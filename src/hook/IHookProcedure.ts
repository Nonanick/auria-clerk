import { IEntityProcedureResponse } from '../procedure/entity/IEntityProcedureResponse';
import { IModelProcedureResponse } from '../procedure/model/IModelProcedureResponse';

export type IHookProcedure = IHookEntityProcedure | IHookModelProcedure;

interface IHookProcedureBase {
  appliesTo: 'model' | 'entity';
  procedure: string;
}

export interface IHookModelProcedure extends IHookProcedureBase {
  appliesTo: 'model';
  hook(response: IModelProcedureResponse, context: {}): void;
}

export interface IHookEntityProcedure extends IHookProcedureBase {
  appliesTo: 'entity';
  hook(response: IEntityProcedureResponse, context: {}): void;
}