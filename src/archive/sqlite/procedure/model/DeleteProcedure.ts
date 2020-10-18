import { SQLiteArchive } from '../../SQLiteArchive';
import { SQLiteArchiveTransaction } from '../../transaction/SQLiteArchiveTransaction';
import { ISQLiteModelProcedure } from './ISQLiteModelProcedure';

export const DeleteProcedure:
  ISQLiteModelProcedure
  = {
  name: 'delete',
  async execute(this: SQLiteArchive | SQLiteArchiveTransaction, request) {

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