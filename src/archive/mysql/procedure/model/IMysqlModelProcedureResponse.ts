import { IModelProcedureResponse } from '../../../../procedure/model/IModelProcedureResponse';

export interface IMysqlModelProcedureResponse extends IModelProcedureResponse {
  sql: string;
  bindParams: any[];
}