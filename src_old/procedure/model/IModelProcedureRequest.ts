import { Entity } from '../../entity/Entity';
import { StoredEntity } from '../../entity/StoredEntity';
import { Model } from '../../model/Model';
import { StoredModel } from '../../model/StoredModel';

export interface IModelProcedureRequest {
  procedure: string;
  entity: StoredEntity;
  model: StoredModel;
}

export function implementsModelProcedureRequest(obj: any): obj is IModelProcedureRequest {
  if (obj == null) return false;

  return (
    typeof obj.procedure === 'string'
    && obj.model instanceof Model
    && obj.entity instanceof Entity
  );
}