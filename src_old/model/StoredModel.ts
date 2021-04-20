import { ProcedureProxyWildcard, StoredEntity } from "../entity/StoredEntity";
import { UnknownEntityProperty } from "../error/entity/UnknownEntityProperty";
import { UnrelatedProperty } from "../error/entity/UnrelatedProperty";
import { IHookModelProcedure } from "../hook/IHookProcedure";
import { IModelProcedureContext } from "../procedure/model/context/IModelProcedureContext";
import { IModelProcedureHook } from "../procedure/model/hook/IModelProcedureHook";
import { IModelProcedureRequest } from "../procedure/model/IModelProcedureRequest";
import { PropertyGetProxy, PropertySetProxy } from "../property";
import {
  IProxyModelProcedureRequest,
  IProxyModelProcedureResponse,
} from "../proxy/IProxyProcedure";
import { IQueryRequest } from "../query";
import { Model } from "./Model";

export class StoredModel<T = unknown> extends Model<T> {
  protected $_entity: StoredEntity;

  protected $_proxies: StoredModelProxies = {
    get: {},
    set: {},
    procedures: {},
  };

  get $__proxies() {
    return this.$_proxies;
  }

  $entity() {
    return this.$_entity;
  }

  protected $_hooks: ModelHooks = {};

  constructor(entity: StoredEntity) {
    super(entity);
    this.$_entity = entity;
  }

  $proxyProcedure(
    proxy: IProxyModelProcedureRequest | IProxyModelProcedureResponse,
  ): void {
    let procedure = proxy.procedure;

    if (typeof procedure === "string") {
      procedure = [procedure];
    }

    for (let proc of procedure) {
      if (this.$_proxies.procedures[proc] == null) {
        this.$_proxies.procedures[proc] = { request: [], response: [] };
      }

      switch (proxy.proxies) {
        case "request":
          this.$_proxies.procedures[proc].request.push(
            proxy as IProxyModelProcedureRequest,
          );
          break;
        case "response":
          this.$_proxies.procedures[proc].response.push(
            proxy as IProxyModelProcedureResponse,
          );
          break;
      }
    }
  }

  $hookProcedure(
    hook: IHookModelProcedure,
  ): Model {
    const procedure = hook.procedure;

    if (this.$_hooks[procedure] == null) {
      this.$_hooks[procedure] = [];
    }

    this.$_hooks[procedure].push(hook);
    return this;
  }

  async $execute(procedure: string, context?: IModelProcedureContext) {
    let isValid = await this.$commit(true);
    if (isValid instanceof Error) {
      return isValid;
    }

    if (this.$_procedures[procedure] == null) {
      throw new Error(
        `Procedure ${procedure} was not added to models of entity ${this.$_entity.name}!`,
      );
    }

    let request: IModelProcedureRequest = {
      entity: this.$_entity,
      procedure: procedure,
      model: this,
    };

    context = {
      ...context,
    };

    // Apply request wildcard proxies
    for (
      let modelProxy
        of this.$_proxies.procedures[ProcedureProxyWildcard]?.request ?? []
    ) {
      let req = await modelProxy.apply(request, context);
      if (req instanceof Error) {
        return req;
      }
      request = req;
    }

    // Apply request specific proxies
    for (
      let modelProxy of this.$_proxies.procedures[procedure]?.request ?? []
    ) {
      let req = await modelProxy.apply(request, context);
      if (req instanceof Error) {
        return req;
      }
      request = req;
    }

    const maybeResponse = await this.$entity().archive.resolveRequest(
      request,
      context,
    );
    if (maybeResponse instanceof Error) {
      return maybeResponse;
    }

    let response = maybeResponse;

    // Apply response wildcard proxies
    for (
      let modelProxy of this.$_proxies.procedures[procedure]?.response ?? []
    ) {
      let res = await modelProxy.apply(response);
      if (res instanceof Error) {
        return res;
      }
      response = res;
    }

    // Apply response wildcard proxies
    for (
      let modelProxy
        of this.$_proxies.procedures[ProcedureProxyWildcard]?.response ?? []
    ) {
      let res = await modelProxy.apply(response);
      if (res instanceof Error) {
        return res;
      }
      response = res;
    }

    return response;
  }

  async $related(propertyName: string, query?: Partial<IQueryRequest>) {
    if (this.$_properties[propertyName] == null) {
      return new UnknownEntityProperty(
        "Unknown property " + propertyName + " in model of entity " +
          this.$_entity.name,
      );
    }
    const property = this.$_properties[propertyName];
    if (!property.hasRelation()) {
      return new UnrelatedProperty(
        "Cannot fetch related data of property " + propertyName +
          " as it doesn't seem to have its relation declared!",
      );
    }

    const relation = property.getRelation()!;

    const fetchRelationQuery: IQueryRequest = {
      entity: relation.entity,
      properties: relation.returning,
      filters: {
        "associate": [relation.property, "=", this.$get(propertyName)],
        ...relation.filters,
      },
      limit: relation.limit,
      order: relation.order,
      ...query,
    };

    return fetchRelationQuery;
  }
}

type StoredModelProxies = {
  get: {
    [propertyName: string]: PropertyGetProxy[];
  };
  set: {
    [propertyName: string]: PropertySetProxy[];
  };
  procedures: {
    [name: string]: {
      request: IProxyModelProcedureRequest[];
      response: IProxyModelProcedureResponse[];
    };
  };
};

type ModelHooks = {
  [procedureName: string]: IModelProcedureHook[];
};
