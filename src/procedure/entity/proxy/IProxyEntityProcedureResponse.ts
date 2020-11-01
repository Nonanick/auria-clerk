import { Maybe, MaybePromise } from '../../../error/Maybe';
import { IEntityProcedureResponse } from '../IEntityProcedureResponse';

export interface IProxyEntityProcedureResponse {
  name: string;
  proxy(response: IEntityProcedureResponse): Maybe<IEntityProcedureResponse> | MaybePromise<IEntityProcedureResponse>;
}