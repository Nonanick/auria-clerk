import { IModelValidation } from '../model/validate/IModelValdation';
import { IEntityProcedureHook } from "../procedure/entity/hook/IEntityProcedureHook";
import { IEntityProcedure } from "../procedure/entity/IEntityProcedure";
import { IProxyEntityProcedureRequest } from "../procedure/entity/proxy/IProxyEntityProcedureRequest";
import { IProxyEntityProcedureResponse } from "../procedure/entity/proxy/IProxyEntityProcedureResponse";
import { IModelProcedureHook } from "../procedure/model/hook/IModelProcedureHook";
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IProxyModelProcedureRequest } from "../procedure/model/proxy/IProxyModelProcedureRequest";
import { IProxyModelProcedureResponse } from "../procedure/model/proxy/IProxyModelProcedureResponse";
import { IProperty, IPropertyIdentifier } from "../property/IProperty";
import { IFilterQuery } from "../query/filter/IFilterQuery";
import { IOrderBy } from "../query/order/IOrderBy";

export interface IEntity {
  // Unique identifier inside a store
  name: string;

  // Source name, optional source name, may differ from entity name
  source?: string;

  // Property that uniquely identifies a model of this entity
  identifier?: IPropertyIdentifier;

  // All properties of the models of this entity
  properties: {
    [name: string]: Omit<IProperty, "name">;
  };

  // Entity will be naturally ordered by...
  orderBy?: string | IOrderBy;

  // Add default filters
  filters?: IFilterQuery;

  // Model validation
  validate?: {
    [name: string]: IModelValidation;
  };

  // Entity procedures
  procedures?: {
    optOut?: {
      create?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    model?: {
      [name: string]: IModelProcedure<any, any>;
    };
    entity?: {
      [name: string]: IEntityProcedure;
    };
  };

  // Proxy entity/model procedures, intervene in the natural flow 
  proxy?: {
    // Model procedures target a single model
    model?: {
      procedure?: {
        [procedureName: string]: {
          request: IProxyModelProcedureRequest[];
          response: IProxyModelProcedureResponse[];
        };
      };
    };

    // Entity procedures can target multiple models 
    entity?: {
      procedure?: {
        [procedureName: string]: {
          request: IProxyEntityProcedureRequest[];
          response: IProxyEntityProcedureResponse[];
        };
      };
    };
  };

  // Trigger actions without intervening in the life cycle 
  hooks?: {
    procedure?: {
      model?: {
        [procedureName: string]: IModelProcedureHook[];
      };
      entity?: {
        [procedureName: string]: IEntityProcedureHook[];
      };
    };
    lifecycle?: {
      model?: {

      };
      entity?: {

      };
    };
  };

}


export type EntityDefaultFilter = IFilterQuery & {
  locked?: boolean;
};