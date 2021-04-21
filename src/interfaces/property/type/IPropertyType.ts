import type { Primitive } from 'type-fest';
import type { IPropertySanitizer } from '../sanitizer/IPropertySanitizer';
import type { IPropertySerializer } from '../serialize/IPropertySerializer';
import type { IPropertyUnserializer } from '../serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '../validation/IPropertyValidation';

export interface IPropertyType {
  type : string;
  
  required? : boolean;
  descriptive? : boolean;
  identifier? : boolean;

  sanitizers? : {
    [name : string] : IPropertySanitizer<Primitive>;
  };

  validations? : {
    [name : string] : IPropertyValidation<Primitive>;
  };

  serializer? : IPropertySerializer<Primitive, String>;

  unserialize? : IPropertyUnserializer<String, Primitive>;
  
  default? : Primitive | (() => Primitive) | (() => Promise<Primitive>);
}