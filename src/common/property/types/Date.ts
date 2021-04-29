import type { IProperty } from '@lib/property/IProperty';
import type { IPropertySanitizer } from '@lib/property/sanitizer/IPropertySanitizer';
import type { IPropertySerializer } from '@lib/property/serialize/IPropertySerializer';
import type { IPropertyUnserializer } from '@lib/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';
import type { Except } from 'type-fest';

export const DateTypeSymbol = Symbol('DateType');

export function DateType(typeDef?: DateTypeDefinition): Except<IDateTypeProperty, "name"> {

  const PropertyDef: Except<IDateTypeProperty, "name"> = { 
    type: DateTypeSymbol, 
    ...typeDef
  };

  return PropertyDef;
}

export interface IDateTypeProperty extends IProperty {

  type: Symbol;

  sanitizers?: { [name: string]: IPropertySanitizer<Date>; };
  validations?: { [name: string]: IPropertyValidation<Date>; };

  serializer?: IPropertySerializer<string, Date>;
  unserializer?: IPropertyUnserializer<Date, string>;

  default?: Date | (() => Date) | (() => Promise<Date>) | null | undefined;

}

type DateTypeDefinition = Except<IDateTypeProperty, "type">;