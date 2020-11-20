import { IEntityProcedureRequest } from './IEntityProcedureRequest';

export interface IEntityProcedureResponse {
  procedure: string;
  success: boolean;
  request: IEntityProcedureRequest;
  [name: string]: any;
}

export function implementsEntityProcedureResponse(obj: any): obj is IEntityProcedureResponse {
  if (obj == null) return false;
  return (
    typeof obj.procedure === 'string'
    && typeof obj.success === 'boolean'
    && typeof obj.request === 'object'

  );
}