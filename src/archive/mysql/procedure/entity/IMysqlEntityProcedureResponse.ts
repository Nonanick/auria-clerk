import { IEntityProcedureRequest } from '../../../../procedure/entity/IEntityProcedureRequest';
import { IEntityProcedureResponse } from '../../../../procedure/entity/IEntityProcedureResponse';

export interface IMysqlEntityProcedureResponse extends IEntityProcedureResponse {
  success: boolean;
  request: IEntityProcedureRequest;
  sql: string;
  bindedParams: any[];
}