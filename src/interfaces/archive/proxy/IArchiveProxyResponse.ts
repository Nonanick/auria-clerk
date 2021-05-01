import { MaybePromise } from '../../../error/MaybePromise';
import { IArchiveResponse } from '../procedure/response/IArchiveResponse';

export interface IArchiveProxyResponse {
  proxies : 'response';
  procedure : string | string[] | Symbol | Symbol[];
  proxyFn : (response: IArchiveResponse ) => MaybePromise<IArchiveResponse>;
}