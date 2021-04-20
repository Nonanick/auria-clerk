import { AppError } from '../../error/AppError';
import { IProxyModelProcedureRequest } from '../../proxy/IProxyProcedure';
import { QueryRequest } from '../../query';
import { FilterAsArray } from '../../query/filter/FilterComparison';

export const UniqueConstraint: IProxyModelProcedureRequest = {

  appliesTo: 'model',
  procedure: ['create', 'update'],
  proxies: 'request',
  name: 'unique-properties',

  apply: async (req) => {

    let uniqueProps: string[] = [];
    let ent = req.model.$entity();

    for (let propName in ent.properties) {
      let prop = ent.properties[propName];
      if (prop.isUnique()) {
        uniqueProps.push(propName);
      }
    }

    if (uniqueProps.length > 0) {
      let queryReq = new QueryRequest(ent);

      queryReq.addFilter('has-unique', {
        $or: uniqueProps.map(p => [p, '=', req.model.$get(p)] as FilterAsArray)
      });
      queryReq.properties = ['_id'];
      let alreadyExists = await queryReq.exists();

      if (alreadyExists !== false) {
        return new AppError(
          'Unique constraint violation!\n' +
          'Check if the following properties already exists in the database:\n'
          + uniqueProps.map(p => p + ' = ' + req.model.$get(p)));
      }

    }

    return req;
  }
};