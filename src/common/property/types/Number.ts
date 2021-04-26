import type { IProperty } from '@lib/property/IProperty';
import type { IPropertySanitizer } from '@lib/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '@lib/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '@lib/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';
import type { Except } from 'type-fest';

export const NumberTypeSymbol = Symbol('NumberType');

export function NumberType(typeDef?: NumberTypeDefinition): Except<INumberTypeProperty, "name"> {

  const PropertyDef: Except<INumberTypeProperty, "name"> = { 
    type: NumberTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface INumberTypeProperty extends IProperty {

  type: Symbol;

  sanitizers?: { [name: string]: IPropertySanitizer<number>; };
  validations?: { [name: string]: IPropertyValidation<number>; };

  serializer?: IPropertySerializer<string, number>;
  unserializer?: IPropertyUnserializer<number, string>;

  default?: number | (() => number) | (() => Promise<number>) | null | undefined;

}

type NumberTypeDefinition = Except<INumberTypeProperty, "type">;