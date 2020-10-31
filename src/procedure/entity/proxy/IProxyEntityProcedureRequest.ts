import { MaybePromise, Maybe } from '../../../error/Maybe';
import { IEntityProcedureRequest } from '../IEntityProcedureRequest';

export interface IProxyEntityProcedureRequest {
  name: string;
  proxy: (request: IEntityProcedureRequest) => Maybe<IEntityProcedureRequest> | MaybePromise<IEntityProcedureRequest>;
}