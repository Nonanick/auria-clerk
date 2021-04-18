import { Except, JsonObject } from 'type-fest';
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

interface IBaseProperty<T = any> {
  name: string;
  isIdentifier?: boolean;
  isDescriptive?: boolean;
  required?: boolean;
  private?: boolean;
  unique?: boolean;
  relatedTo?: IPropertyRelation;
  validate?: PropertyValidationFunction<T> | IPropertyValidation<T> | IPropertyValidation<T>;
  sanitize?: PropertySanitizationFunction<T> | IPropertySanitization<T> | IPropertySanitization<T>[];
  proxy?: {
    get?: PropertyGetProxy<T>[];
    set?: PropertySetProxy<T>[];
  };
}

interface IDateProperty extends IBaseProperty<Date> {
  type: 'date';
  default?: Date | (() => Date);
}
interface IStringProperty extends IBaseProperty<String> {
  type: 'string';
  default?: String | (() => String);
}

interface INumberProperty extends IBaseProperty<Number> {
  type: 'number';
  default?: Number | (() => Number);
}

interface IBooleanProperty extends IBaseProperty<Boolean> {
  type: 'boolean' | 'bool';
  default?: Boolean | (() => Boolean);
}

interface IObjectProperty extends IBaseProperty<JsonObject> {
  type: 'object';
  default?: JsonObject | (() => JsonObject);
}

interface IArrayProperty<T = any> extends IBaseProperty<Array<T>> {
  type: 'array';
  default?: Array<T> | (() => Array<T>);
}

interface IPropertyTypeProperty extends IBaseProperty<any> {
  type: IPropertyType;
  default?: DefaultValue;
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
