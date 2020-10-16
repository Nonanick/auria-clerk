import { MysqlArchive } from "../../MysqlArchive";
import { MysqlArchiveTransaction } from '../../transaction/MysqlArchiveTransaction';
import { IMysqlModelProcedure } from './IMysqlModelProcedure';

export const CreateProcedure:
  IMysqlModelProcedure
  = {
  name: 'create',
  async execute(this: MysqlArchive | MysqlArchiveTransaction, request) {

    let insertSQL = 'INSERT INTO source () VALUES()';
    
    this.execute(
      insertSQL
    );

    return {
      request,
      model: request.model,
      success: true,
    };
  }
};