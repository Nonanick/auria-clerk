import { MaybePromise } from '../../error/Maybe';
import { IEntityProcedureRequest } from './IEntityProcedureRequest';
import { IEntityProcedureResponse } from './IEntityProcedureResponse';

export interface IEntityProcedure {
  name: string;
  execute: EntityProcedureFunction;
}

export type EntityProcedureFunction = (request: IEntityProcedureRequest) => MaybePromise<IEntityProcedureResponse>;