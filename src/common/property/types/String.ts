import type { IProperty } from '@lib/property/IProperty';
import type { IPropertySanitizer } from '@lib/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '@lib/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '@lib/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';
import type { Except } from 'type-fest';

export const StringTypeSymbol = Symbol('StringType');

export function StringType(typeDef?: StringTypeDefinition): Except<IStringTypeProperty, "name"> {

  const PropertyDef: Except<IStringTypeProperty, "name"> = { 
    type: StringTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface IStringTypeProperty extends IProperty {

  type: Symbol;

  sanitizers?: { [name: string]: IPropertySanitizer<string>; };
  validations?: { [name: string]: IPropertyValidation<string>; };

  serializer?: IPropertySerializer<string, string>;
  unserializer?: IPropertyUnserializer<string, string>;

  default?: string | (() => string | null) | (() => Promise<string | null>) | null | undefined;

}

type StringTypeDefinition = Except<IStringTypeProperty, "type">;