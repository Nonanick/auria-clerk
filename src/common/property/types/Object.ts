import type { Except, JsonObject } from 'type-fest';
import { IProperty } from '../../../interfaces/property/IProperty';
import { IPropertySanitizer } from '../../../interfaces/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '../../../interfaces/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '../../../interfaces/property/serialize/IPropertyUnserializer';
import { IPropertyValidation } from '../../../interfaces/property/validation/IPropertyValidation';

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
  unserializer?: IPropertyUnserializer<JsonObject, string>;

  default?: JsonObject | (() => JsonObject) | (() => Promise<JsonObject>) | null | undefined;

}

type ObjectTypeDefinition = Except<IObjectTypeProperty, "type">;