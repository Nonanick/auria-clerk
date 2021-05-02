import type { Except } from 'type-fest';
import { IEntity } from '../../../interfaces/entity/IEntity';
import { IProperty } from '../../../interfaces/property/IProperty';
import { IPropertySanitizer } from '../../../interfaces/property/sanitizer/IPropertySanitizer';
import { IPropertySerializer } from '../../../interfaces/property/serialize/IPropertySerializer';
import { IPropertyUnserializer } from '../../../interfaces/property/serialize/IPropertyUnserializer';
import { IPropertyValidation } from '../../../interfaces/property/validation/IPropertyValidation';
import { Entity } from '../../../lib/entity/Entity';

export const EntityTypeSymbol = Symbol('EntityType');

export function EntityType<Item extends IEntity<{}> = IEntity<{}>>(
  typeDef: EntityTypeDefinition<Item> | Item
): IEntityProperty<Item> {
  let PropertyDef: IEntityProperty<Item>;

  if (Entity.is(typeDef)) {
    PropertyDef = {
      type: EntityTypeSymbol,
      entity: typeDef as Item
    };
  } else {
    PropertyDef = {
      type: EntityTypeSymbol,
      ...typeDef
    };
  }

  return PropertyDef;
}

export interface IEntityProperty<Item extends IEntity<{}>> extends IProperty {

  type: Symbol;

  entity: Item;

  sanitizers?: { [name: string]: IPropertySanitizer<Item[]>; };
  validations?: { [name: string]: IPropertyValidation<Item[]>; };

  serializer?: IPropertySerializer<string, Item[]>;
  unserializer?: IPropertyUnserializer<Item[], string>;

  default?: bigint | (() => bigint) | (() => Promise<bigint>) | null | undefined;

}

type EntityTypeDefinition<Item extends IEntity<{}>> = Except<IEntityProperty<Item>, "type">;