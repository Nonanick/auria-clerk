import type { IProperty } from '@lib/property/IProperty';
import type { IPropertySanitizer } from '@lib/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '@lib/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '@lib/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';
import type { Except, JsonValue } from 'type-fest';

export const ArrayTypeSymbol = Symbol('ArrayType');

export function ArrayType<Item = JsonValue>(typeDef: ArrayTypeDefinition<Item>): Except<IArrayTypeProperty<Item>, "name"> {

  const PropertyDef: Except<IArrayTypeProperty<Item>, "name"> = { 
    type: ArrayTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface IArrayTypeProperty<Item extends JsonValue> extends IProperty {

  type: Symbol;

  item : Item;

  sanitizers?: { [name: string]: IPropertySanitizer<Item[]>; };
  validations?: { [name: string]: IPropertyValidation<Item[]>; };

  serializer?: IPropertySerializer<string, Item[]>;
  unserializer?: IPropertyUnserializer<Item[], string>;

  default?: bigint | (() => bigint) | (() => Promise<bigint>) | null | undefined;

}

type ArrayTypeDefinition<Item> = Except<IArrayTypeProperty<Item>, "type">;