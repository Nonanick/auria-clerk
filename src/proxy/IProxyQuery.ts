import { MaybePromise } from '../error/Maybe';
import { QueryRequest, QueryResponse } from '../query';

export type IProxyQuery =
  | IProxyQueryRequest
  | IProxyQueryResponse;

interface IProxyQueryBase {
  proxies: 'request' | 'response';
  toEntity?: string | string[];
  passive?: boolean;
}

export interface IProxyQueryRequest extends IProxyQueryBase {
  proxies: 'request';
  apply(request: QueryRequest): MaybePromise<QueryRequest>;
}

export interface IProxyQueryResponse extends IProxyQueryBase {
  proxies: 'response';
  apply(request: QueryResponse): MaybePromise<QueryResponse>;
}

export function implementsProxyQuery(obj: any): obj is IProxyQuery {
  if (obj == null) {
    return false;
  }

  return (
    (obj.proxies === 'request' || obj.proxies === 'response')
    && typeof obj.apply === 'function'
    && typeof obj.procedure === 'undefined'
  );
}