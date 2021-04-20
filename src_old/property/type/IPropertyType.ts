import { IPropertyDecode } from "../decode/IPropertyDecode";
import { IPropertyEncode } from "../encode/IPropertyEncode";
import { IPropertySanitization } from "../sanitize/IPropertySanitization";
import { IPropertyValidation } from "../validation/IPropertyValidation";

export interface IPropertyType {
  name: string;
  raw: 'string' | 'boolean' | 'bool' | 'array' | 'object' | 'number' | 'date';
  validate?: IPropertyValidation | IPropertyValidation[];
  sanitize?: IPropertySanitization;
  encode?: IPropertyEncode;
  decode?: IPropertyDecode;
  toDTO: () => string;
}

export function isPropertyType(obj: any): obj is IPropertyType {
  return (
    // Name
    typeof obj.name === "string" &&
    // Raw
    typeof obj.raw === "object" &&
    // Validate
    ((
      obj.validate != null &&
      (Array.isArray(obj.validate) || typeof obj.validate === "function")
    ) || obj.validate == null) &&
    // Sanitize
    ((obj.sanitize != null && typeof obj.sanitize === "function") ||
      obj.sanitize == null)
  );
}
