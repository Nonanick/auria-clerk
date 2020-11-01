import { Maybe, MaybePromise } from '../../../error/Maybe';
import { IModelProcedureResponse } from '../IModelProcedureResponse';

export interface IProxyModelProcedureResponse {
  name: string;
  proxy(response: IModelProcedureResponse): Maybe<IModelProcedureResponse> | MaybePromise<IModelProcedureResponse>;
}