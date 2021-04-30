import type { MaybePromise } from '@error/MaybePromise';
import type { IArchiveEntity } from '@interfaces/archive/entity/IArchiveEntity';
import type { IArchive } from '@interfaces/archive/IArchive';
import type { IArchiveModel } from '@interfaces/archive/model/IArchiveModel';
import type { IArchiveProxy } from '@interfaces/archive/proxy/IArchiveProxy';
import type { IArchiveProxyRequest } from '@interfaces/archive/proxy/IArchiveProxyRequest';
import type { IArchiveProxyResponse } from '@interfaces/archive/proxy/IArchiveProxyResponse';
import type { IQueryRequest } from '@interfaces/archive/query/IQueryRequest';
import type { IQueryResponse } from '@interfaces/archive/query/IQueryResponse';
import type { IEntity } from '@interfaces/entity/IEntity';
import { IProperty } from '@interfaces/property/IProperty';
import type { JsonObject } from 'type-fest';
import { Type } from '../../common/property/types';
import { Entity } from '../../lib/entity/Entity';
import { ArchiveModel } from '../model/ArchiveModel';
import { AllProcedures } from '../proxy/AllProcedures';

export class ArchiveEntity<
  Type extends {} = JsonObject,
  > extends Entity<Type> implements IArchiveEntity<Type> {


  static from<T extends {} = JsonObject>(archive: IArchive, entity: IEntity): ArchiveEntity<T> {
    const ent: ArchiveEntity<T> = new ArchiveEntity(archive, entity);

    return ent;
  }

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
      (model as any)[procedure] = async (context?: any) => {
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