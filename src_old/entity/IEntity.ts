import { isPropertyType } from "../property";
import { IHookProcedure } from "../hook/IHookProcedure";
import { IModelValidation } from "../model/validate/IModelValidation";
import { IEntityProcedure } from "../procedure/entity/IEntityProcedure";
import { IModelProcedure } from "../procedure/model/IModelProcedure";
import {
  IProperty,
 // IArrayProperty,
  IBooleanProperty,
  IDateProperty,
  INumberProperty,
  IObjectProperty,
  IPropertyTypeProperty,
  IStringProperty,
  IPropertyIdentifier,
  ValidPropertyType,
  IArrayProperty
} from "../property/IProperty";
import { IProxyProcedure } from "../proxy/IProxyProcedure";
import { IFilterQuery } from "../query/filter/IFilterQuery";
import { IOrderBy } from "../query/order/IOrderBy";
import { Except } from 'type-fest';

export interface IEntity {
  // Unique identifier inside a store
  name: string;

  // Source name, optional source name, may differ from entity name
  source?: string;

  // Property that uniquely identifies a model of this entity
  identifier?: IPropertyIdentifier;

  // All properties of the models of this entity
  properties: {
    [name: string]: PropertyInDictionary | Exclude<ValidPropertyType,"array">;
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
    [name: string]: Except<IProxyProcedure, "name"> & {};
  } | IProxyProcedure[];

  // Trigger actions without intervening in the life cycle
  hooks?: {
    [name: string]: Except<IHookProcedure, "name"> & {};
  };
}

export function getAsIProperty(
  name: string,
  prop: PropertyInDictionary | Exclude<ValidPropertyType,"array">,
): IProperty {

  if (
    prop === 'string' 
    || prop === 'object' 
    || prop === 'number' 
    || prop === 'boolean' 
    || prop === "bool" 
    || prop === 'date' 
  ) {
    return {
      name,
      type: prop
    };
  }

  if (isPropertyType(prop)) {
    return {
      name,
      type: prop
    }
  }

  return {
    ...prop as IProperty,
    name,
  };
}

export type PropertyInDictionary =
  | Except<IPropertyTypeProperty, "name">
  | Except<IDateProperty, "name">
  | Except<IStringProperty, "name">
  | Except<INumberProperty, "name">
  | Except<IObjectProperty, "name">
  | Except<IBooleanProperty, "name">
  | Except<IArrayProperty, "name">;

export type PropertyDictionary = {
  [name: string]: PropertyInDictionary;
};

export type EntityDefaultFilter = IFilterQuery & {
  locked?: boolean;
};
