import { MaybePromise } from '../../error/Maybe';
import { IEntityProcedureContext } from './IEntityProcedureContext';
import { IEntityProcedureRequest } from './IEntityProcedureRequest';
import { IEntityProcedureResponse } from './IEntityProcedureResponse';

export interface IEntityProcedure<Context extends IEntityProcedureContext = IEntityProcedureContext> {
  name: string;
  execute: EntityProcedureFunction<Context>;
}

export type EntityProcedureFunction<Context extends IEntityProcedureContext> =
  (request: IEntityProcedureRequest<Context>) => MaybePromise<IEntityProcedureResponse>;