import { DefaultValue } from "./default/DefaultValue";
import { PropertyGetProxy } from "./proxy/PropertyGetProxy";
import { PropertySetProxy } from "./proxy/PropertySetProxy";
import { IPropertyRelation } from "./relation/IPropertyRelation";
import { IPropertySanitization, PropertySanitizationFunction } from "./sanitize/IPropertySanitization";
import { IPropertyType } from "./type/IPropertyType";
import { IPropertyValidation, PropertyValidationFunction } from "./validation/IPropertyValidation";

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
}

export type ValidPropertyType = IPropertyType | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | ObjectConstructor;

export type IPropertyIdentifier = Omit<IProperty, "isIdentifier" | "relatedTo" | "required"> & {};