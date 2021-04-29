import type { MaybePromise } from '@error/MaybePromise';
import type { IEntity } from '@lib/entity/IEntity';
import type { JsonObject } from 'type-fest';
import type { IArchiveModel } from '../model/IArchiveModel';
import type { IArchiveProxy } from '../proxy/IArchiveProxy';
import type { IArchiveProxyRequest } from '../proxy/IArchiveProxyRequest';
import type { IArchiveProxyResponse } from '../proxy/IArchiveProxyResponse';
import type { IQueryRequest } from '../query/IQueryRequest';
import type { IQueryResponse } from '../query/IQueryResponse';

export interface IArchiveEntity<
  T extends {} = JsonObject,
  > extends IEntity {

  model(): IArchiveModel<T>;

  query(request: IQueryRequest): MaybePromise<IQueryResponse>;

  procedures(): string[];

  allProxies: {
    [name: string]: IArchiveProxy;
  };

  proxy(
    name : string,
    moment: 'request',
    procedure: string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxyRequest['proxyFn']
  ): IArchiveEntity<T>;
  proxy(
    name : string,
    moment: 'response',
    procedure:  string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxyResponse['proxyFn']
  ): IArchiveEntity<T>;

  getRequestProxies(): IArchiveProxyRequest[];
  getRequestProxies(procedure: string | Symbol): IArchiveProxyRequest[];

  getResponseProxies(): IArchiveProxyResponse[];
  getResponseProxies(procedure: string | Symbol): IArchiveProxyResponse[];

}