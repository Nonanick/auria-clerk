import type { MaybePromise } from '@error/MaybePromise';
import type { IArchiveRequest } from '../procedure/request/IArchiveRequest';

export interface IArchiveProxyRequest {
  proxies : 'request';
  procedure : string | string[] | Symbol;
  proxyFn : (request : IArchiveRequest ) => MaybePromise<IArchiveRequest>;
}
