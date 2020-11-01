import { AppError } from '../../../../error/AppError';
import { IModelProcedure } from '../../../../procedure/model/IModelProcedure';
import { ComparableValues } from '../../../../query/filter/FilterComparisson';
import { SQLiteArchive } from '../../SQLiteArchive';

export const CreateProcedure:
  IModelProcedure
  = {
  name: 'create',
  async execute(archive, request) {

    if (!(archive instanceof SQLiteArchive)) {
      return new Error('Procedure expects SQLite Archive!');
    }

    const model = request.model;
    const propertyNames: string[] = [];
    const propertyValues: ComparableValues[] = [];
    let insertSQL = `INSERT INTO \`${request.entity.source}\` ( `;

    // Update state and fetch values
    let allValues = await model.$commit();

    // Failed?
    if (allValues instanceof Error) {
      return allValues;
    }

    for (let propName in allValues) {
      propertyNames.push(propName);
      propertyValues.push(allValues[propName]);
    }

    // Check for required properties
    for (let propertyName in request.entity.properties) {
      let property = request.entity.properties[propertyName];
      if (
        property.isRequired()
        && !propertyNames.includes(propertyName)
      ) {
        return new AppError(
          + 'Failed to insert row into the MYSQL database!'
          + `\nProperty ${propertyName} is marked as required but was not set!`
        );
      }
    }

    if (
      propertyNames.length <= 0
      && propertyValues.length <= 0
      && propertyValues.length !== propertyNames.length
    ) {
      return new AppError(
        'Failed to build mysql INSERT query, the number of properties and values mismatch!'
      );
    }

    // Build SQL
    insertSQL +=
      // (`prop1` , `prop2` , `prop3`)
      propertyNames
        .map(f => `\`${f}\``)
        .join(' , ')
      + ' ) VALUES ( '
      // VALUES ( ? , ? , ?)
      + propertyValues
        .map(f => ' ? ')
        .join(' , ')
      + ')';

    try {

      let queryResponse = await archive.execute(
        insertSQL,
        propertyValues
      );

      console.log(
        'INSERT QUERY response: ', queryResponse,
        '\nLast inserted ID: ', await archive.lastInsertedId()
      );

      return {
        request,
        model: request.model,
        success: true,
      };

    } catch (err) {
      console.error('FAILED to insert model into mysql table!', err);
      return {
        request,
        model: request.model,
        success: false,
      };
    }

  }
};