import { Entity } from '../../entity/Entity';
import { IEntityProcedureContext } from './IEntityProcedureContext';

export interface IEntityProcedureRequest<Context extends IEntityProcedureContext = IEntityProcedureContext> {
  procedure: string;
  entity: Entity;
  context: Context;
}

export function implementsEntityProcedureRequest(obj: any): obj is IEntityProcedureRequest {
  if (obj == null) return false;

  return (
    typeof obj.procedure === 'string'
    && obj.entity instanceof Entity
    && typeof obj.context === 'object'
  );

}