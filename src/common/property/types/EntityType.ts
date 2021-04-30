import type { IEntity } from '@interfaces/entity/IEntity';
import type { IProperty } from '@interfaces/property/IProperty';
import type { IPropertySanitizer } from '@interfaces/property/sanitizer/IPropertySanitizer';
import type { IPropertySerializer } from '@interfaces/property/serialize/IPropertySerializer';
import type { IPropertyUnserializer } from '@interfaces/property/serialize/IPropertyUnserializer';
import type { IPropertyValidation } from '@interfaces/property/validation/IPropertyValidation';
import type { Except } from 'type-fest';
import { Entity } from '../../../lib/entity/Entity';

export const EntityTypeSymbol = Symbol('EntityType');

export function EntityType<Item extends IEntity = IEntity>(typeDef: EntityTypeDefinition<Item> | Item): Except<IEntityType<Item>, "name"> {
  let PropertyDef: Except<IEntityType<Item>, "name">;

  if (Entity.is(typeDef)) {
    PropertyDef = {
      type: EntityTypeSymbol,
      entity: typeDef
    };
  } else {
    PropertyDef = {
      type: EntityTypeSymbol,
      ...typeDef
    };
  }

  return PropertyDef;
}

export interface IEntityType<Item extends IEntity> extends IProperty {

  type: Symbol;

  entity: Item;

  sanitizers?: { [name: string]: IPropertySanitizer<Item[]>; };
  validations?: { [name: string]: IPropertyValidation<Item[]>; };

  serializer?: IPropertySerializer<string, Item[]>;
  unserializer?: IPropertyUnserializer<Item[], string>;

  default?: bigint | (() => bigint) | (() => Promise<bigint>) | null | undefined;

}

type EntityTypeDefinition<Item extends IEntity> = Except<IEntityType<Item>, "type">;