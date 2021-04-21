import type { IProperty } from '@lib/property/IProperty';
import type { IPropertySanitizer } from '@lib/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '@lib/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '@lib/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';
import type { Except, JsonObject } from 'type-fest';

export const ObjectTypeSymbol = Symbol('ObjectType');

export function ObjectType(typeDef: ObjectTypeDefinition): Except<IObjectTypeProperty, "name"> {

  const PropertyDef: Except<IObjectTypeProperty, "name"> = { 
    type: ObjectTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface IObjectTypeProperty extends IProperty {

  type: Symbol;

  sanitizers?: { [name: string]: IPropertySanitizer<JsonObject>; };
  validations?: { [name: string]: IPropertyValidation<JsonObject>; };

  serializer?: IPropertySerializer<string, JsonObject>;
  unserializer?: IPropertyUnserializer<bigint, JsonObject>;

  default?: JsonObject | (() => JsonObject) | (() => Promise<JsonObject>) | null | undefined;

}

type ObjectTypeDefinition = Except<IObjectTypeProperty, "type">;