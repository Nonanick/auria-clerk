import type { IEntity } from '@interfaces/entity/IEntity';
import type { IArchiveEntity } from './entity/IArchiveEntity';
import type { IArchiveProcedure } from './procedure/IArchiveProcedure';
import { IArchiveProxy } from './proxy/IArchiveProxy';
import { IArchiveProxyRequest } from './proxy/IArchiveProxyRequest';
import { IArchiveProxyResponse } from './proxy/IArchiveProxyResponse';

export interface IArchive {

  entity(entity: IEntity): IArchiveEntity;

  procedures: {
    [name: string]: IArchiveProcedure;
  };

  allProxies: {
    [name: string]: IArchiveProxy;
  };

  proxy(
    name : string,
    moment: 'request',
    procedure: string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxyRequest['proxyFn']
  ): IArchive;
  proxy(
    name : string,
    moment: 'response',
    procedure:  string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxyResponse['proxyFn']
  ): IArchive;

  getRequestProxies(): IArchiveProxyRequest[];
  getRequestProxies(procedure: string | Symbol): IArchiveProxyRequest[];

  getResponseProxies(): IArchiveProxyResponse[];
  getResponseProxies(procedure: string | Symbol): IArchiveProxyResponse[];

}