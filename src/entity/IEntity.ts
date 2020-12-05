import { IHookProcedure } from '../hook/IHookProcedure';
import { IModelValidation } from '../model/validate/IModelValidation';
import { IEntityProcedure } from "../procedure/entity/IEntityProcedure";
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import { IProperty, IPropertyIdentifier } from "../property/IProperty";
import { IProxyProcedure } from '../proxy/IProxyProcedure';
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
    [name: string]: Omit<IProperty, "name"> & {};
  };

  // Entity will be naturally ordered by...
  orderBy?: string | IOrderBy;

  // Add default filters
  filters?: IFilterQuery;

  // Model validation
  validate?: IModelValidation | IModelValidation[];

  // Entity procedures
  procedures?: {
    ofModel?: {
      [name: string]: IModelProcedure<any> | string;
    };
    ofEntity?: {
      [name: string]: IEntityProcedure | string;
    };
  };

  // Proxy entity/model procedures, intervene in the natural flow 
  proxy?: {
    [name: string]: Omit<IProxyProcedure, "name"> & {};
  };

  // Trigger actions without intervening in the life cycle 
  hooks?: {
    [name: string]: Omit<IHookProcedure, "name"> & {};
  };

}


export type EntityDefaultFilter = IFilterQuery & {
  locked?: boolean;
};