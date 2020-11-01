import { IModelProcedure } from '../../../../procedure/model/IModelProcedure';
import { SQLiteArchive } from '../../SQLiteArchive';

export const DeleteProcedure:
  IModelProcedure
  = {
  name: 'delete',
  async execute(archive, request) {

    if (!(archive instanceof SQLiteArchive)) {
      return new Error('Procedure expects SQLite Archive!');
    }
    const model = request.model;
    let deleteSQL = `DELETE FROM \`${request.entity.source}\` `;

    // Filter by identifier
    deleteSQL += ` WHERE \`${request.entity.identifier.name}\` = ?`;

    try {
      let queryResponse = await archive.execute(
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