import type { Except } from 'type-fest';
import type { IProperty } from '../../../interfaces/property/IProperty';
import type { IPropertySanitizer } from '../../../interfaces/property/sanitizer/IPropertySanitizer';
import type { IPropertySerializer } from '../../../interfaces/property/serialize/IPropertySerializer';
import type { IPropertyUnserializer } from '../../../interfaces/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '../../../interfaces/property/validation/IPropertyValidation';

export const ArrayTypeSymbol = Symbol('ArrayType');

export function ArrayType<Item extends ArrayItemType = ArrayItemType>(typeDef: ArrayTypeDefinition<Item>): IArrayProperty<Item> {

  let validations = typeDef.validations ?? {};

  // Add validations from item
  validations.ValidateEachItemInArray = async (items : Item['type'][]) => {

    return true;
  }

  const PropertyDef: IArrayProperty<Item> = {
    type: ArrayTypeSymbol,
    ...typeDef,
    validations
  };

  return PropertyDef;
}

export interface IArrayProperty<Item extends ArrayItemType> extends IProperty {

  type: Symbol;

  item: Item;

  sanitizers?: { [name: string]: IPropertySanitizer<Item['type'][]>; };
  validations?: { [name: string]: IPropertyValidation<Item['type'][]>; };

  serializer?: IPropertySerializer<string, Item['type'][]>;
  unserializer?: IPropertyUnserializer<Item['type'][], string>;


  default?: bigint | (() => bigint) | (() => Promise<bigint>) | null | undefined;

}

type ArrayTypeDefinition<Item extends ArrayItemType> = Except<IArrayProperty<Item>, "type">;

type ArrayItemType = IProperty;