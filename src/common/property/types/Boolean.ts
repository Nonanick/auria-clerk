import type { Except } from 'type-fest';
import { IProperty } from '../../../interfaces/property/IProperty';
import { IPropertySanitizer } from '../../../interfaces/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '../../../interfaces/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '../../../interfaces/property/serialize/IPropertyUnserializer';
import { IPropertyValidation } from '../../../interfaces/property/validation/IPropertyValidation';

export const BooleanTypeSymbol = Symbol('BooleanType');

export function BooleanType(typeDef?: BooleanTypeDefinition): Except<IBooleanTypeProperty, "name"> {

  const PropertyDef: Except<IBooleanTypeProperty, "name"> = { 
    type: BooleanTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface IBooleanTypeProperty extends IProperty {

  type: Symbol;

  sanitizers?: { [name: string]: IPropertySanitizer<boolean>; };
  validations?: { [name: string]: IPropertyValidation<boolean>; };

  serializer?: IPropertySerializer<string, boolean>;
  unserializer?: IPropertyUnserializer<boolean, string>;

  default?: boolean | (() => boolean) | (() => Promise<boolean>) | null | undefined;

}

type BooleanTypeDefinition = Except<IBooleanTypeProperty, "type">;