import { DefaultValue } from "./default/DefaultValue";
import { PropertyGetProxy } from "./proxy/PropertyGetProxy";
import { PropertySetProxy } from "./proxy/PropertySetProxy";
import { IPropertyRelation } from "./relation/IPropertyRelation";
import { IPropertySanitization, PropertySanitizationFunction } from "./sanitize/IPropertySanitization";
import { IPropertyType } from "./type/IPropertyType";
import { IPropertyValidation, PropertyValidationFunction } from "./validation/IPropertyValidation";

export interface IProperty {
  name: string;
  type: IPropertyType | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | ArrayBufferConstructor;
  isIdentifier?: boolean;
  isDescriptive?: boolean;
  required?: boolean;
  private?: boolean;
  default?: DefaultValue;
  validate?: PropertyValidationFunction | IPropertyValidation | IPropertyValidation[];
  sanitize?: PropertySanitizationFunction | IPropertySanitization | IPropertySanitization[];
  relatedTo?: IPropertyRelation;
  proxy?: {
    get?: PropertyGetProxy[];
    set?: PropertySetProxy[];
  };
}

export type IPropertyIdentifier = Omit<IProperty, "isIdentifier" | "relatedTo" | "required">;