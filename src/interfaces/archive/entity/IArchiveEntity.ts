import type { MaybePromise } from '@error/MaybePromise';
import type { IEntity } from '@lib/entity/IEntity';
import { JsonObject } from 'type-fest';
import type { IArchiveModel } from '../model/IArchiveModel';
import { IArchiveProxy } from '../proxy/IArchiveProxy';
import { IArchiveProxyRequest } from '../proxy/IArchiveProxyRequest';
import { IArchiveProxyResponse } from '../proxy/IArchiveProxyResponse';
import type { IQueryRequest } from '../query/IQueryRequest';
import type { IQueryResponse } from '../query/IQueryResponse';

export interface IArchiveEntity<
  T extends JsonObject = JsonObject,
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