import { Maybe, MaybePromise } from '../../../error/Maybe';
import { IModelProcedureRequest } from '../IModelProcedureRequest';

export interface IProxyModelProcedureRequest {
  name: string;
  proxy(request: IModelProcedureRequest): Maybe<IModelProcedureRequest> | MaybePromise<IModelProcedureRequest>;
}