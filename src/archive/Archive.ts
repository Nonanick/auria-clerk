import { AllProcedures } from './proxy/AllProcedures';
import type { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import type { IArchive } from '@lib/archive/IArchive';
import type { IArchiveProcedure } from '@lib/archive/procedure/IArchiveProcedure';
import type { IArchiveProxy, IArchiveProxyRequest, IArchiveProxyResponse } from '@lib/archive/proxy/IArchiveProxy';
import type { IEntity } from '@lib/entity/IEntity';

export abstract class Archive implements IArchive {

  #proxies: {
    [name: string]: IArchiveProxy
  } = {};

  get proxies(): { [name: string]: IArchiveProxy; } {
    return { ...this.#proxies };
  }

  proxy(
    name : string,
    moment: 'request',
    procedure: string | Symbol,
    proxy: IArchiveProxyRequest['proxyFn']): IArchive;
  proxy(
    name : string,
    moment: 'response',
    procedure: string | Symbol,
    proxy: IArchiveProxyResponse['proxyFn']
  ): IArchive;
  proxy(
    name : string,
    moment: 'request' | 'response',
    procedure: string | Symbol,
    proxy: IArchiveProxy['proxyFn']): IArchive {
      
    this.#proxies[name] = {
      proxies : moment,
      procedure,
      proxyFn : proxy,
    } as IArchiveProxy;

    return this;
  }

  getRequestProxies(): IArchiveProxyRequest[];
  getRequestProxies(procedure: string | Symbol): IArchiveProxyRequest[];
  getRequestProxies(procedure?: string | Symbol): IArchiveProxyRequest[] {

    return Object.values(this.#proxies)
      .filter(p => p.proxies === 'request')
      .filter(p => {

        if (procedure == null) {
          return true;
        }

        if (procedure === p.procedure || p.procedure === AllProcedures) {
          return true;
        }

        return false;
      }) as IArchiveProxyRequest[];
  }

  getResponseProxies(): IArchiveProxyResponse[];
  getResponseProxies(procedure: string): IArchiveProxyResponse[];
  getResponseProxies(procedure?: string): IArchiveProxyResponse[] {
    return Object.values(this.#proxies)
      .filter(p => p.proxies === 'request')
      .filter(p => {
        if (procedure == null) return true;
        return procedure === p.procedure || p.procedure === AllProcedures;
      }) as IArchiveProxyResponse[];
  }

  abstract entity(entity: IEntity): IArchiveEntity;

  abstract get procedures(): {
    [name: string]: IArchiveProcedure
  };

}