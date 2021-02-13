import { StoredEntity } from '../../entity/StoredEntity';
import { IEntityProcedureContext } from './IEntityProcedureContext';

export interface IEntityProcedureRequest<Context extends IEntityProcedureContext = IEntityProcedureContext> {
  procedure: string;
  entity: StoredEntity;
  context: Context;
}

export function implementsEntityProcedureRequest(obj: any): obj is IEntityProcedureRequest {
  if (obj == null) return false;

  return (
    typeof obj.procedure === 'string'
    && obj.entity instanceof StoredEntity
    && typeof obj.context === 'object'
  );

}