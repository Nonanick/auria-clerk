import { AppError } from '../../../../error/AppError';
import { IModelProcedure } from '../../../../procedure/model/IModelProcedure';
import { ComparableValues } from '../../../../query/filter/FilterComparisson';
import { IArchive } from '../../../IArchive';
import { SQLiteArchive } from '../../SQLiteArchive';

export const UpdateProcedure: IModelProcedure = {
  name: 'update',
  async execute(archive: IArchive, request) {

    if (!(archive instanceof SQLiteArchive)) {
      return new Error('Procedure expects SQLite Archive!');
    }

    const model = request.model;
    const propertyNames: string[] = request.model.$changedProperties();
    const propertyValues: ComparableValues[] = [];
    let updateSQL = `UPDATE \`${request.entity.source}\` SET `;

    // Update state and fetch values
    let allValues = await model.$commit();

    // Failed?
    if (allValues instanceof Error) {
      return allValues;
    }

    for (let propertyName of propertyNames) {
      propertyValues.push(
        await model.$get(propertyName)
      );
    }

    if (
      propertyNames.length <= 0
      && propertyValues.length <= 0
      && propertyValues.length !== propertyNames.length
    ) {
      return new AppError(
        'Failed to build mysql UPDATE query, the number of properties and values mismatch!'
      );
    }

    // Build SQL
    updateSQL +=
      // SET `a` = ? , `b` = ?
      propertyNames
        .map(f => `\`${f}\` = ?`)
        .join(' , ');

    // Filter by identifier
    updateSQL += ` WHERE \`${request.entity.identifier.name}\` = ?`;
    // Add to parameters
    propertyValues.push(await model.$id());

    try {

      let queryResponse = await archive.execute(
        updateSQL,
        propertyValues
      );

      console.log(
        'UPDATE QUERY response: ', queryResponse
      );

      return {
        request,
        model: request.model,
        success: true,
      };

    } catch (err) {
      console.error('FAILED to update model using SQL query ',);
      return {
        request,
        model: request.model,
        success: false,
      };
    }

  }
};