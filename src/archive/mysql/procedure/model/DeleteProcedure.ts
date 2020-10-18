import { MysqlArchive } from "../../MysqlArchive";
import { MysqlArchiveTransaction } from '../../transaction/MysqlArchiveTransaction';
import { IMysqlModelProcedure } from './IMysqlModelProcedure';

export const DeleteProcedure:
  IMysqlModelProcedure
  = {
  name: 'delete',
  async execute(this: MysqlArchive | MysqlArchiveTransaction, request) {

    const model = request.model;
    let deleteSQL = `DELETE FROM \`${request.entity.source}\` `;

    // Filter by identifier
    deleteSQL += ` WHERE \`${request.entity.identifier.name}\` = ?`;

    try {
      let queryResponse = await this.execute(
        deleteSQL,
        [await model.$id()]
      );

      console.log(
        'DELETE QUERY response: ', queryResponse
      );

      return {
        request,
        model: request.model,
        success: true,
      };

    } catch (err) {
      console.error('FAILED to delete model using SQL query ',);
      return {
        request,
        model: request.model,
        success: false,
      };
    }

  }
};