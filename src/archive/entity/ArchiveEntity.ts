import type { MaybePromise } from '@error/MaybePromise';
import type { IArchiveEntity } from '@lib/archive/entity/IArchiveEntity';
import type { IArchive } from '@lib/archive/IArchive';
import type { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import type { IArchiveProxy } from '@lib/archive/proxy/IArchiveProxy';
import type { IArchiveProxyRequest } from '@lib/archive/proxy/IArchiveProxyRequest';
import type { IArchiveProxyResponse } from '@lib/archive/proxy/IArchiveProxyResponse';
import type { IQueryRequest } from '@lib/archive/query/IQueryRequest';
import type { IQueryResponse } from '@lib/archive/query/IQueryResponse';
import type { IEntity } from '@lib/entity/IEntity';
import type { JsonObject } from 'type-fest';
import { Entity } from '../../lib/entity/Entity';
import { ArchiveModel } from '../model/ArchiveModel';
import { AllProcedures } from '../proxy/AllProcedures';

export class ArchiveEntity<
  Type extends JsonObject = JsonObject,
  > extends Entity<Type> implements IArchiveEntity<Type> {

  #archive: IArchive;

  #proxies: {
    [name: string]: IArchiveProxy
  } = {};

  archive(): IArchive {
    return this.#archive;
  }

  get allProxies(): { [name: string]: IArchiveProxy; } {
    return { ...this.#proxies };
  }

  model(): IArchiveModel<Type> {
    // Apply modification from super class
    const model = super.model(
      new ArchiveModel<Type>(this)
    );

    // Add entity procedures to model
    this.procedures().forEach(procedure => {
      (model as any)[procedure] = async (context? : any) => {
        return (this as any)[procedure]([model], context);
      };
    });

    return model;

  }

  query(req: IQueryRequest): MaybePromise<IQueryResponse> {
    throw new Error('Method not implemented.');
  }

  /**
   * Method which indicates what properties inside this Archive are procedures
   * Procedures are passed down to models when being created
   * 
   * all properties of this class listed inside this array should be of type:
   * @type {ProcedureModelFunction}
   * 
   * @returns 
   */
  procedures() {
    return [];
  }

  proxy(
    name: string,
    moment: 'request',
    procedure: string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxyRequest['proxyFn']): IArchiveEntity<Type>;
  proxy(
    name: string,
    moment: 'response',
    procedure: string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxyResponse['proxyFn']
  ): IArchiveEntity<Type>;
  proxy(
    name: string,
    moment: 'request' | 'response',
    procedure: string | string[] | Symbol | Symbol[],
    proxy: IArchiveProxy['proxyFn']): IArchiveEntity<Type> {

    this.#proxies[name] = {
      proxies: moment,
      procedure,
      proxyFn: proxy,
    } as IArchiveProxy;

    return this;
  }

  getRequestProxies(): IArchiveProxyRequest[];
  getRequestProxies(procedure: string | Symbol): IArchiveProxyRequest[];
  getRequestProxies(procedure?: string | Symbol): IArchiveProxyRequest[] {

    return Object.values(this.#proxies)
      // Only request proxies
      .filter(proxy => proxy.proxies === 'request')
      // That match the procedure being requested
      .filter(proxy => this.doesProxyMatchesProcedure(proxy, procedure)) as IArchiveProxyRequest[];
  }

  getResponseProxies(): IArchiveProxyResponse[];
  getResponseProxies(procedure: string): IArchiveProxyResponse[];
  getResponseProxies(procedure?: string): IArchiveProxyResponse[] {

    return Object.values(this.#proxies)
      // Only response proxies
      .filter(p => p.proxies === 'request')
      // That match procedure being requested
      .filter(p => this.doesProxyMatchesProcedure(p, procedure)) as IArchiveProxyResponse[];
  }

  doesProxyMatchesProcedure(proxy: IArchiveProxy, procedure?: string | Symbol): boolean {
    // Empty procedure => return all response proxies
    if (procedure == null) return true;

    // Exact match of procedure => include it in the return
    if (procedure === proxy.procedure || proxy.procedure === AllProcedures) return true;

    // Type annotation> Typescript wont let me generically call 'includes' when string and symbol are involved
    // This can be either an array of string or an array of symbols either way if the procedure, which can be 
    // identified by a symbol or string, is included in such array we will include this proxy as a returne value!
    if (
      Array.isArray(proxy.procedure)
      // Not actually stirng[]!
      && (proxy.procedure as string[]).includes(procedure as string)
    ) {
      return true;
    }

    return false;
  }

  constructor(archive: IArchive, entity: IEntity) {
    super(entity);
    this.#archive = archive;
  }

}