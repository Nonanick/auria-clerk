import type { IProperty } from '@lib/property/IProperty';
import type { IPropertySanitizer } from '@lib/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '@lib/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '@lib/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';
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