import { Entity } from '../../entity/Entity';
import { Model } from '../../model/Model';

export interface IModelProcedureRequest {
  procedure: string;
  entity: Entity;
  model: Model;
}

export function implementsModelProcedureRequest(obj: any): obj is IModelProcedureRequest {
  if (obj == null) return false;

  return (
    typeof obj.procedure === 'string'
    && obj.model instanceof Model
    && obj.entity instanceof Entity
  );
}