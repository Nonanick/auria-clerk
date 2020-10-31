import { Entity } from '../../entity/Entity';
import { IEntityProcedureContext } from './IEntityProcedureContext';

export interface IEntityProcedureRequest<Context extends IEntityProcedureContext = IEntityProcedureContext> {
  entity: Entity;
  procedure: string;
  context: Context;
} 