import { JsonObject } from 'type-fest';
import { DefaultValue } from "./default/DefaultValue";
import { PropertyGetProxy } from "./proxy/PropertyGetProxy";
import { PropertySetProxy } from "./proxy/PropertySetProxy";
import { IPropertyRelation } from "./relation/IPropertyRelation";
import { IPropertySanitization, PropertySanitizationFunction } from "./sanitize/IPropertySanitization";
import { IPropertyType } from "./type/IPropertyType";
import { IPropertyValidation, PropertyValidationFunction } from "./validation/IPropertyValidation";

export type IProperty =
  //| IGeneralProperty 
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

interface IGeneralProperty extends IBaseProperty<any> {
  type: ValidPropertyType;
  default?: DefaultValue;
}

interface IDateProperty extends IBaseProperty<Date> {
  type: DateConstructor | IPropertyType;
  default?: Date | (() => Date);
}

interface IStringProperty extends IBaseProperty<String> {
  type: StringConstructor | IPropertyType;
  default?: String | (() => String);
}

interface INumberProperty extends IBaseProperty<Number> {
  type: NumberConstructor | IPropertyType;
  default?: Number | (() => Number);
}

interface IBooleanProperty extends IBaseProperty<Boolean> {
  type: BooleanConstructor| IPropertyType;
  default?: Boolean | (() => Boolean);
}

interface IObjectProperty extends IBaseProperty<JsonObject> {
  type: ObjectConstructor | IPropertyType;
  default?: JsonObject | (() => JsonObject);
}

interface IArrayProperty<T = any> extends IBaseProperty<Array<T>> {
  type : ArrayConstructor;
  default? : Array<T> | (() => Array<T>);
}

export type ValidPropertyType = IPropertyType | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | ObjectConstructor | ArrayConstructor;

export type IPropertyIdentifier = Omit<IProperty, "isIdentifier" | "relatedTo" | "required">;
