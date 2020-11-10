import { IArchive } from '../IArchive';
import { SQLiteConnectionInfo } from './connection/SQLiteConnetionInfo';
import { QueryRequest } from '../../query/QueryRequest';
import { MaybePromise } from '../../error/Maybe';
import { QueryResponse } from '../../query/QueryResponse';
import { IFilterQuery, implementsFilterComparison } from '../../query/filter/IFilterQuery';
import { ComparableValues, FilterComparison } from '../../query/filter/FilterComparison';
import { PropertyComparison } from '../../property/comparison/PropertyComparison';
import { IModelProcedure } from '../../procedure/model/IModelProcedure';
import { IEntityProcedure } from '../../procedure/entity/IEntityProcedure';
import { Database } from 'sqlite3';
import { SQLiteArchiveTransaction } from './transaction/SQLiteArchiveTransaction';

export class SQLiteArchive implements IArchive {

  protected _connectionInfo: SQLiteConnectionInfo;

  protected _sqliteConn?: Database;

  protected _modelProcedures: {
    [name: string]: IModelProcedure;
  } = {};

  protected _entityProcedures: {
    [name: string]: IEntityProcedure;
  } = {};

  constructor(connectionInfo: SQLiteConnectionInfo) {
    this._connectionInfo = connectionInfo;
  }

  addModelProcedure(
    name: string,
    procedure: IModelProcedure
  ): void {
    let modifiedProcedure: IModelProcedure = {
      name: procedure.name,
      execute: procedure.execute.bind(this)
    };

    this._modelProcedures[name] = modifiedProcedure;
  }

  addEntityProcedure(
    name: string,
    procedure: IEntityProcedure
  ): void {
    let modifiedProcedure: IEntityProcedure = {
      name: procedure.name,
      execute: procedure.execute.bind(this)
    };

    this._entityProcedures[name] = modifiedProcedure;
  }

  async connect() {
    return new Promise<Database>((resolve, reject) => {

      this._sqliteConn = new Database(
        this._connectionInfo.filename,
        this._connectionInfo.openMode,
        (err) => {
          if (err == null) {
            resolve(this._sqliteConn);
          } else {
            reject(err);
          }
        }
      );

    });

  }

  async connection(): Promise<Database> {

    if (this._sqliteConn == null) {
      await this.connect();
    }

    return this._sqliteConn!;

  }

  async query(request: QueryRequest): MaybePromise<QueryResponse> {
    let sql = this.requestToSQL(request);

    let conn = await this.connection();
    console.log(
      'Will now run query',
      sql.query,
      'with params',
      sql.params
    );

    let stmt = await conn.prepare(sql.query, sql.params);
    return new Promise<QueryResponse>((resolve, reject) => {
      stmt.get((err, rows) => {
        if (err != null) {
          reject(err);
          return;
        }
        let response = new QueryResponse(request);
        response.addRows(rows);
        resolve(response);
      });
    });


  }

  requestToSQL(request: QueryRequest): GeneratedQuerySQL {

    let builtSQL: string = `SELECT `;
    let params: {
      [name: string]: ComparableValues;
    } = {};

    let entityName = request.source;

    // Properties specified ?
    if (request.properties.length > 0) {

      builtSQL += request.properties
        .map(p => `\`${entityName}\`.\`${p}\``)
        .join(' , ');

    }
    // by default, only fetch non-private properties
    else {
      let allProps: string[] = [];
      for (let prop in request.entity.properties) {
        let p = request.entity.properties[prop];
        if (p.isPrivate() !== true) {
          allProps.push(prop);
        }
      }
      // if no property exists use '*'
      builtSQL += allProps.length === 0
        ? '*'
        : allProps
          .map(p => `\`${entityName}\`.\`${p}\``)
          .join(',');
    }

    // Source
    builtSQL += ` FROM \`${entityName}\` `;

    // Filters ?
    if (request.hasFilter()) {

      let filters: string[] = [];

      for (let filterName in request.filters) {
        let filter = request.filters[filterName]!;
        let partialFilter = this.sqlFromFilter(filter, params);
        if (Array.isArray(partialFilter)) {
          filters.push(...partialFilter);
        } else {
          filters.push(partialFilter);
        }
      }
      let filterString = filters.map(f => `(${f})`).join(' AND ');

      if (filterString.length > 0) {
        builtSQL += ` WHERE ${filterString} `;
      }

    }

    // Order By
    if (request.hasOrder()) {
      let orderSQL: string[] = [];
      for (let order of request.ordering) {
        orderSQL.push(
          order.property
          + (order.direction === 'desc' ? 'DESC' : '')
        );
      }

      if (orderSQL.length > 0) {
        builtSQL += ' ORDER BY ' + orderSQL.join(' , ');
      }
    }

    // Limiter + pagination ?
    if (request.hasLimiter()) {
      builtSQL += ` LIMIT ${request.limit.amount}`;
      builtSQL += request.limit.offset != null ? ' OFFSET ' + request.limit.offset : '';
    }

    let parsedQuery = this.parseNamedAttributes(builtSQL, params);
    return parsedQuery;

  }

  parseNamedAttributes(query: string, namedParams: { [name: string]: ComparableValues; }): GeneratedQuerySQL {
    let matches = query.match(/:\[.*?\]/g);
    if (matches != null) {
      let params: ComparableValues[] = [];
      for (let p of matches) {
        let paramName = p.slice(2, -1);
        query = query.replace(p, '?');
        params.push(namedParams[paramName]);
      }
      return {
        query,
        params
      };
    } else {
      return {
        query,
        params: []
      };
    }
  }

  sqlFromFilter(
    filter: FilterComparison[],
    params: { [name: string]: ComparableValues; }
  ): string[];
  sqlFromFilter(
    filter: IFilterQuery | FilterComparison,
    params: { [name: string]: ComparableValues; }
  ): string;
  sqlFromFilter(
    filter: IFilterQuery | FilterComparison | FilterComparison[],
    params: { [name: string]: ComparableValues; }
  ): string | string[];
  sqlFromFilter(
    filter: IFilterQuery | FilterComparison | FilterComparison[],
    params: { [name: string]: ComparableValues; }
  ): string | string[] {

    // Handle array of FilterComparison
    if (Array.isArray(filter)) {
      return filter
        .map(f => this.sqlFromFilter(f, params));
    }

    // Handle FilterComparison
    if (implementsFilterComparison(filter)) {

      // random name -> make it hard to colide parameters names
      //let paramName = this._paramNameGenerator();

      let nonce = 0;

      // Instead of a random param name use source + property so the connection can cache the query
      let paramName = `${filter.source != null ? String(filter.source) : ''}${filter.property}`;
      while (params[paramName + nonce] != null) {
        nonce++;
      }
      // nonce will make sure that we avoid colisions of the same property from the same source
      // being compared more than once

      // Add parameter value to global parameter map
      params[paramName + nonce] = filter.value;

      return (

        filter.source != null
          // Source
          ? '`' + filter.source + '`.'
          : ''

          // Property name
          + ' `' + filter.property + '` '

          // Comparator
          + this.resolveComparison(filter.comparison)

          // Value placeholder
          + ` :[${paramName + nonce}] `
      );
    }

    // Handle IFilterQuery
    let filters: string[] = [];

    for (let name in filter) {

      let f = filter[name]!;
      let filtered: string | string[] = this.sqlFromFilter(f, params);

      if (name === '$or') {
        filters.push(
          (filtered as string[])
            .map(f => `(${f})`)
            .join(' OR ')
        );
      } else if (name === '$not') {
        filters.push(
          ' NOT (' +
          (filtered as string[])
            .map(f => `(${f})`)
            .join(' AND ')
          + ') '
        );
      } else {
        if (Array.isArray(filtered)) {
          filters.push(
            (filtered as string[])
              .map(f => `(${f})`)
              .join(' AND ')
          );
        } else {
          filters.push(filtered);
        }
      }
    }

    return filters.map(f => `${f}`).join(' AND ');

  }

  resolveComparison(comparison: PropertyComparison): string {
    switch (comparison) {
      // equal
      case 'equal':
      case 'eq':
      case '=':
      case '==':
        return '=';
      // not equal
      case 'neq':
      case 'not equal':
      case '<>':
      case '!=':
        return '!=';

      // like
      case 'like':
      case '=~':
        return ' LIKE ';

      // not like
      case 'not like':
      case '!=~':
        return ' NOT LIKE ';

      // lesser than
      case '<':
      case 'lt':
      case 'lesser than':
        return '<';

      // greater than
      case '>':
      case 'gt':
      case 'greater than':
        return '>';

      // lesser than or equal to
      case '<=':
      case 'lte':
      case 'lesser than or equal to':
        return '<=';

      // greater than or equal to
      case '>=':
      case 'gte':
      case 'greater than or equal to':
        return '>=';

      // included
      case 'in':
      case 'included in':
      case 'contained in':
        return ' IN ';

      // not included
      case 'not in':
      case 'not included in':
      case 'not contained in':
        return ' NOT IN';
    }
  }

  transaction(): SQLiteArchiveTransaction {
    let trx = new SQLiteArchiveTransaction(this);

    return trx;
  }

  async lastInsertedId(): MaybePromise<any> {
    return await this.execute('SELECT last_inserted_id();');
  }

  async execute(query: string, params: ComparableValues[] = []) {
    let stmt = (await this.connection()).prepare(query, params);
    return new Promise((resolve, reject) => {
      stmt.run((err) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
}

export type GeneratedQuerySQL = {
  query: string;
  params: any[];
};