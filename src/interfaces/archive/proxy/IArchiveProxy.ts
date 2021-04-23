import type { MaybePromise } from '@error/MaybePromise';
import type { IArchiveRequest } from './request/IArchiveRequest';
import type { IArchiveResponse } from './response/IArchiveResponse';

export type IArchiveProxy = IArchiveProxyRequest | IArchiveProxyResponse;

export interface IArchiveProxyRequest {
  proxies : 'request';
  procedure : string | Symbol;
  proxyFn : (request : IArchiveRequest ) => MaybePromise<IArchiveRequest>;
}

export interface IArchiveProxyResponse {
  proxies : 'response';
  procedure : string | Symbol;
  proxyFn : (response: IArchiveResponse ) => MaybePromise<IArchiveResponse>;

}