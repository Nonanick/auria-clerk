import { IPropertyDecode } from "../decode/IPropertyDecode";
import { IPropertyEncode } from "../encode/IPropertyEncode";
import { IPropertySanitization } from "../sanitize/IPropertySanitization";
import { IPropertyValidation } from "../validation/IPropertyValidation";

export interface IPropertyType {
  name: string;
  raw: StringConstructor | BooleanConstructor | DateConstructor | NumberConstructor | ArrayBufferConstructor | ObjectConstructor;
  validate?: IPropertyValidation | IPropertyValidation[];
  sanitize?: IPropertySanitization;
  encode?: IPropertyEncode;
  decode?: IPropertyDecode;
}