import { Except, JsonArray, JsonObject } from 'type-fest';
import { DefaultValue } from './default/DefaultValue';
import { PropertyGetProxy } from "./proxy/PropertyGetProxy";
import { PropertySetProxy } from "./proxy/PropertySetProxy";
import { IPropertyRelation } from "./relation/IPropertyRelation";
import { IPropertySanitization, PropertySanitizationFunction } from "./sanitize/IPropertySanitization";
import { IPropertyType } from "./type/IPropertyType";
import { IPropertyValidation, PropertyValidationFunction } from "./validation/IPropertyValidation";

export type IProperty =
  | IPropertyTypeProperty
  | IDateProperty
  | IStringProperty
  | INumberProperty
  | IObjectProperty
  | IBooleanProperty
  | IArrayProperty;

/*
export interface IProperty {
  name: string;
  type: ValidPropertyType;
  isIdentifier?: boolean;
  isDescriptive?: boolean;
  required?: boolean;
  private?: boolean;
  unique?: boolean;
  default?: DefaultValue;
  validate?: PropertyValidationFunction | IPropertyValidation | IPropertyValidation[];
  sanitize?: PropertySanitizationFunction | IPropertySanitization | IPropertySanitization[];
  relatedTo?: IPropertyRelation;
  proxy?: {
    get?: PropertyGetProxy[];
    set?: PropertySetProxy[];
  };
}*/

interface IBaseProperty {
  name: string;
  isIdentifier?: boolean;
  isDescriptive?: boolean;
  required?: boolean;
  private?: boolean;
  unique?: boolean;
  relatedTo?: IPropertyRelation;

}

export interface IDateProperty extends IBaseProperty {
  type: 'date';
  default?: Date | (() => Date);
  name: string;
  validate?: (PropertyValidationFunction<Date>) | (IPropertyValidation<Date>) | (IPropertyValidation<Date>[]);
  sanitize?: (PropertySanitizationFunction<Date>) | (IPropertySanitization<Date>) | (IPropertySanitization<Date>[]);
  proxy?: {
    get?: PropertyGetProxy<Date>[];
    set?: PropertySetProxy<Date>[];
  };
}

export interface IStringProperty extends IBaseProperty {
  type: 'string';
  default?: String | (() => String);
  validate?: (PropertyValidationFunction<String>) | (IPropertyValidation<String>) | (IPropertyValidation<String>[]);
  sanitize?: (PropertySanitizationFunction<String>) | (IPropertySanitization<String>) | (IPropertySanitization<String>[]);
  proxy?: {
    get?: PropertyGetProxy<String>[];
    set?: PropertySetProxy<String>[];
  };
}

export interface INumberProperty extends IBaseProperty {
  type: 'number';
  default?: Number | (() => Number);
  validate?: (PropertyValidationFunction<Number>) | (IPropertyValidation<Number>) | (IPropertyValidation<Number>[]);
  sanitize?: (PropertySanitizationFunction<Number>) | (IPropertySanitization<Number>) | (IPropertySanitization<Number>[]);
  proxy?: {
    get?: PropertyGetProxy<Number>[];
    set?: PropertySetProxy<Number>[];
  };
}

export interface IBooleanProperty extends IBaseProperty {
  type: 'boolean' | 'bool';
  default?: Boolean | (() => Boolean);
  validate?: (PropertyValidationFunction<Boolean>) | (IPropertyValidation<Boolean>) | (IPropertyValidation<Boolean>[]);
  sanitize?: (PropertySanitizationFunction<Boolean>) | (IPropertySanitization<Boolean>) | (IPropertySanitization<Boolean>[]);
  proxy?: {
    get?: PropertyGetProxy<Boolean>[];
    set?: PropertySetProxy<Boolean>[];
  };
}

export interface IObjectProperty extends IBaseProperty {
  type: 'object';
  default?: JsonObject | (() => JsonObject);
  validate?: (PropertyValidationFunction<JsonObject>) | (IPropertyValidation<JsonObject>) | (IPropertyValidation<JsonObject>[]);
  sanitize?: (PropertySanitizationFunction<JsonObject>) | (IPropertySanitization<JsonObject>) | (IPropertySanitization<JsonObject>[]);
  proxy?: {
    get?: PropertyGetProxy<JsonObject>[];
    set?: PropertySetProxy<JsonObject>[];
  };
}

export interface IArrayProperty extends IBaseProperty {
  type: 'array';
  default?: JsonArray | (() => JsonArray);
  validate?: (PropertyValidationFunction<JsonArray>) | (IPropertyValidation<JsonArray>) | (IPropertyValidation<JsonArray>[]);
  sanitize?: (PropertySanitizationFunction<JsonArray>) | (IPropertySanitization<JsonArray>) | (IPropertySanitization<JsonArray>[]);
  proxy?: {
    get?: PropertyGetProxy<JsonArray>[];
    set?: PropertySetProxy<JsonArray>[];
  };
}

export interface IPropertyTypeProperty extends IBaseProperty {
  type: IPropertyType;
  default?: DefaultValue;
  validate?: (PropertyValidationFunction<DefaultValue>) | (IPropertyValidation<DefaultValue>) | (IPropertyValidation<DefaultValue>[]);
  sanitize?: (PropertySanitizationFunction<DefaultValue>) | (IPropertySanitization<DefaultValue>) | (IPropertySanitization<DefaultValue>[]);
  proxy?: {
    get?: PropertyGetProxy<DefaultValue>[];
    set?: PropertySetProxy<DefaultValue>[];
  };
}


export type ValidPropertyType =
  | IPropertyType
  | 'string'
  | 'number'
  | 'boolean'
  | 'bool'
  | 'date'
  | 'object'
  | 'array';

export type IPropertyIdentifier = Except<IProperty, "isIdentifier" | "relatedTo" | "required">;
