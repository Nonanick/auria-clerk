import { MaybePromise } from '../error/Maybe';
import { IEntityProcedure } from '../procedure/entity/IEntityProcedure';
import { IModelProcedure } from '../procedure/model/IModelProcedure';
import { QueryRequest } from '../query/QueryRequest';
import { QueryResponse } from '../query/QueryResponse';

export interface IArchive {

  addModelProcedure(name: string, procedure: IModelProcedure): void;
  addEntityProcedure(name: string, procedure: IEntityProcedure): void;
  query(queryRequest: QueryRequest): MaybePromise<QueryResponse>;

}