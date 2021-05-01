import type { Except } from 'type-fest';
import { IProperty } from '../../../interfaces/property/IProperty';
import { IPropertySanitizer } from '../../../interfaces/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '../../../interfaces/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '../../../interfaces/property/serialize/IPropertyUnserializer';
import { IPropertyValidation } from '../../../interfaces/property/validation/IPropertyValidation';

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