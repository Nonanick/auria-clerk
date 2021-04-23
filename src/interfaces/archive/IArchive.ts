import type { IEntity } from '@lib/entity/IEntity';
import type { IArchiveEntity } from './entity/IArchiveEntity';
import type { IArchiveProcedure } from './procedure/IArchiveProcedure';
import type { IArchiveProxy, IArchiveProxyRequest, IArchiveProxyResponse } from './proxy/IArchiveProxy';

export interface IArchive {

  entity(entity: IEntity): IArchiveEntity;

  procedures: {
    [name: string]: IArchiveProcedure;
  };

  proxies: {
    [name: string]: IArchiveProxy;
  };

  proxy(
    name : string,
    moment: 'request',
    procedure: string | Symbol,
    proxy: IArchiveProxyRequest['proxyFn']
  ): IArchive;
  proxy(
    name : string,
    moment: 'response',
    procedure: string | Symbol,
    proxy: IArchiveProxyResponse['proxyFn']
  ): IArchive;

  getRequestProxies(): IArchiveProxyRequest[];
  getRequestProxies(procedure: string | Symbol): IArchiveProxyRequest[];

  getResponseProxies(): IArchiveProxyResponse[];
  getResponseProxies(procedure: string): IArchiveProxyResponse[];

}