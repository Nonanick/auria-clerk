import { IArchive } from '../../src/archive/IArchive';
import { Entity, ProcedureProxyWildcard } from '../../src/entity/Entity';
import { Factory } from '../../src/entity/Factory';
import { IEntity } from '../../src/entity/IEntity';
import { Maybe, MaybePromise } from '../../src/error/Maybe';
import { IEntityProcedure } from '../../src/procedure/entity/IEntityProcedure';
import { IEntityProcedureContext } from '../../src/procedure/entity/IEntityProcedureContext';
import { IProxyEntityProcedureRequest } from '../../src/procedure/entity/proxy/IProxyEntityProcedureRequest';
import { IProxyEntityProcedureResponse } from '../../src/procedure/entity/proxy/IProxyEntityProcedureResponse';
import { IModelProcedureContext } from '../../src/procedure/model/context/IModelProcedureContext';
import { IModelProcedure } from '../../src/procedure/model/IModelProcedure';
import { IModelProcedureResponse } from '../../src/procedure/model/IModelProcedureResponse';
import { IPropertyIdentifier } from '../../src/property/IProperty';
import { QueryRequest } from '../../src/query/QueryRequest';
import { QueryResponse } from '../../src/query/QueryResponse';

describe('entity', () => {

  it('should inherit its name properly!', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);
    expect(entity.name).toBe('mock');
  });

  it('should properly add entity procedures!', () => {

    const entity = new Entity(MockedEntity, new MockedFactory);

    const MockedEntityProcedure: IEntityProcedure = {
      name: 'mocked-procedure',
      async execute(request) {
        return {
          success: true,
        };
      }
    };

    entity.addEntityProcedure('mocked-procedure', MockedEntityProcedure);

    expect(entity.execute('mocked-procedure', {})).resolves.toMatchObject({ success: true });

  });

  it('should apply procedure specific request proxies ', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);

    const MockedEntityProcedure: IEntityProcedure<{ proxied: boolean; }> = {
      name: 'mocked-procedure',
      async execute(archive, request) {
        if (request.context.proxied === undefined) {
          return {
            success: false
          };
        }
        return {
          success: true,
        };
      }
    };

    const MockedRequestProcedureProxy: IProxyEntityProcedureRequest = {
      name: 'mocked-entity-proxy',
      proxy(req) {
        req.context.proxied = true;
        return req;
      }
    };

    entity.addEntityProcedure('mocked-procedure', MockedEntityProcedure);
    entity.proxyEntityProcedure('mocked-procedure', 'request', MockedRequestProcedureProxy);

    return expect(entity.execute('mocked-procedure', {})).resolves.toMatchObject({ success: true });

  });

  it('should apply procedure wildcard request proxies ', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);

    const MockedEntityProcedure: IEntityProcedure<{ proxied: boolean; }> = {
      name: 'mocked-procedure',
      async execute(archive, request) {
        if (request.context.proxied === undefined) {
          return {
            success: false
          };
        }
        return {
          success: true,
        };
      }
    };

    const MockedRequestProcedureProxy: IProxyEntityProcedureRequest = {
      name: 'mocked-entity-proxy',
      proxy(req) {
        req.context.proxied = true;
        return req;
      }
    };

    entity.addEntityProcedure('mocked-procedure', MockedEntityProcedure);
    entity.proxyEntityProcedure(ProcedureProxyWildcard, 'request', MockedRequestProcedureProxy);

    return expect(entity.execute('mocked-procedure', {})).resolves.toMatchObject({ success: true });

  });

  it('should apply wildcard proxies and procedure specific request proxies, in this specific order ', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);

    const MockedEntityProcedure: IEntityProcedure<{ proxied: number; }> = {
      name: 'mocked-procedure',
      async execute(archive, request) {
        return {
          success: request.context.proxied === 2,
        };
      }
    };

    const MockedRequestProcedureProxyWild: IProxyEntityProcedureRequest = {
      name: 'mocked-entity-proxy-wild',
      proxy(req) {
        req.context.proxied = 1;
        return req;
      }
    };

    const MockedRequestProcedureProxySpecific: IProxyEntityProcedureRequest = {
      name: 'mocked-entity-proxy-specific',
      proxy(req) {
        req.context.proxied *= 2;
        return req;
      }
    };

    entity.addEntityProcedure('mocked-procedure', MockedEntityProcedure);
    entity.proxyEntityProcedure(ProcedureProxyWildcard, 'request', MockedRequestProcedureProxyWild);
    entity.proxyEntityProcedure('mocked-procedure', 'request', MockedRequestProcedureProxySpecific);

    return expect(entity.execute('mocked-procedure', {})).resolves.toMatchObject({ success: true });

  });

  it('should apply procedure specific response proxies ', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);

    const MockedEntityProcedure: IEntityProcedure<{ proxied: boolean; }> = {
      name: 'mocked-procedure',
      async execute(request) {
        return {
          success: false,
        };
      }
    };

    const MockedResponseProcedureProxy: IProxyEntityProcedureResponse = {
      name: 'mocked-entity-proxy',
      proxy(res) {
        res.success = true;
        return res;
      }
    };

    entity.addEntityProcedure('mocked-procedure', MockedEntityProcedure);
    entity.proxyEntityProcedure('mocked-procedure', 'response', MockedResponseProcedureProxy);

    return expect(entity.execute('mocked-procedure', {})).resolves.toMatchObject({ success: true });

  });

  it('should apply procedure wildcard response proxies ', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);

    const MockedEntityProcedure: IEntityProcedure<{ proxied: boolean; }> = {
      name: 'mocked-procedure',
      async execute(request) {
        return {
          success: false,
        };
      }
    };

    const MockedResponseProcedureProxy: IProxyEntityProcedureResponse = {
      name: 'mocked-entity-proxy',
      proxy(res) {
        res.success = true;
        return res;
      }
    };

    entity.addEntityProcedure('mocked-procedure', MockedEntityProcedure);
    entity.proxyEntityProcedure(ProcedureProxyWildcard, 'response', MockedResponseProcedureProxy);

    return expect(entity.execute('mocked-procedure', {})).resolves.toMatchObject({ success: true });

  });

  it('should apply wildcard proxies and procedure specific request proxies, in this specific order ', () => {
    const entity = new Entity(MockedEntity, new MockedFactory);

    const Procedure: IEntityProcedure<{ proxied: number; }> = {
      name: 'mocked-procedure',
      async execute(request) {
        return {
          success: true,
        };
      }
    };

    const ProxyWildcard: IProxyEntityProcedureResponse = {
      name: 'mocked-entity-proxy-wild',
      proxy(res) {
        res.proxied = 1;
        return res;
      }
    };

    const ProxySpecific: IProxyEntityProcedureResponse = {
      name: 'mocked-entity-proxy-specific',
      proxy(res) {
        res.proxied *= 2;
        return res;
      }
    };

    entity.addEntityProcedure('mocked-procedure', Procedure);

    entity.proxyEntityProcedure(ProcedureProxyWildcard, 'response', ProxyWildcard);
    entity.proxyEntityProcedure('mocked-procedure', 'response', ProxySpecific);

    return expect(
      entity.execute('mocked-procedure', {})
    )
      .resolves
      .toMatchObject({ success: true, proxied: 2 });

  });


});

const MockedEntity: IEntity = {
  name: 'mock',
  properties: {
    prop1: {
      type: String
    }
  }
};



class MockedArchive implements IArchive {

  addModelProcedure(name: string, procedure: IModelProcedure<IModelProcedureContext, IModelProcedureResponse>): void {
    throw new Error('Method not implemented.');
  }
  addEntityProcedure(name: string, procedure: IEntityProcedure<IEntityProcedureContext>): void {
    throw new Error('Method not implemented.');
  }
  query(queryRequest: QueryRequest): MaybePromise<QueryResponse> {
    throw new Error('Method not implemented.');
  }

}

class MockedFactory extends Factory {

  get defaultIdentifier(): IPropertyIdentifier {
    return {
      name: '_id',
      type: String
    };
  }

  get archive(): IArchive {
    return new MockedArchive();
  }

  hydrateEntity(entity: Entity): Maybe<Entity> {
    return entity;
  }

}