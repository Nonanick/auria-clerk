import type { IProperty } from '@interfaces/property/IProperty';
import type { IPropertySanitizer } from '@interfaces/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '@interfaces/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '@interfaces/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@interfaces/property/validation/IPropertyValidation';
import type { Except } from 'type-fest';

export const BigIntTypeSymbol = Symbol('BigIntType');

export function BigIntType(typeDef?: BigIntTypeDefinition): Except<IBigIntTypeProperty, "name"> {

  const PropertyDef: Except<IBigIntTypeProperty, "name"> = { 
    type: BigIntTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface IBigIntTypeProperty extends IProperty {

  type: Symbol;

  sanitizers?: { [name: string]: IPropertySanitizer<bigint>; };
  validations?: { [name: string]: IPropertyValidation<bigint>; };

  serializer?: IPropertySerializer<string, bigint>;
  unserializer?: IPropertyUnserializer<bigint, string>;

  default?: bigint | (() => bigint) | (() => Promise<bigint>) | null | undefined;

}

type BigIntTypeDefinition = Except<IBigIntTypeProperty, "type">;