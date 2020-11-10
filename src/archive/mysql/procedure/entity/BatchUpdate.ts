import { ResultSetHeader } from 'mysql2';
import { MaybePromise } from '../../../../error/Maybe';
import { IEntityProcedureContext } from '../../../../procedure/entity/IEntityProcedureContext';
import { ComparableValues } from '../../../../query/filter/FilterComparison';
import { IFilterQuery } from '../../../../query/filter/IFilterQuery';
import { MysqlArchive } from '../../MysqlArchive';
import { IMysqlEntityProcedure } from './IMysqlEntityProcedure';
import { IMysqlEntityProcedureResponse } from './IMysqlEntityProcedureResponse';

export const BatchUpdate: IMysqlEntityProcedure<BatchUpdateContext> = {
  name: 'batch-update',
  async execute(archive, request) {

    if (!(archive instanceof MysqlArchive)) {
      return new Error('Batch Update expects an MySQL archive!');
    }

    let updateSQL = `UPDATE \`${request.entity.source}\` `;

    const bindParams: any[] = [];
    const updateProperties: string[] = [];
    for (let propName in request.context.values) {
      let value = request.context.values[propName];
      updateProperties.push('`' + request.entity.source + '`.`' + propName + '` = ?');
      bindParams.push(value);
    }
    updateSQL += ' SET ' + updateProperties.join(' , ');

    let whereParams: { [name: string]: ComparableValues; } = {};
    let whereQuery = archive.sqlFromFilter(request.context.filter, whereParams);
    let parsedWhere = archive.parseNamedAttributes(whereQuery, whereParams);
    updateSQL += ' WHERE ' + parsedWhere.query;
    bindParams.push(...parsedWhere.params);

    let batchUpdateResponse = await archive.execute(updateSQL, bindParams);

    let result: ResultSetHeader = batchUpdateResponse[0] as ResultSetHeader;

    return {
      bindedParams: bindParams,
      sql: updateSQL,
      success: result.affectedRows > 0,
      request: request,
    };
  }
};


export interface BatchUpdateContext extends IEntityProcedureContext {
  values: any;
  filter: IFilterQuery;
};

declare module '../../../../entity/Entity' {
  interface Entity {
    execute(procedure: 'batch-update', context: BatchUpdateContext): MaybePromise<IMysqlEntityProcedureResponse>;
  }
}