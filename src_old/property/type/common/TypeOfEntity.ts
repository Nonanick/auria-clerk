import { Entity } from '../../../entity';
import { IEntity } from '../../../entity/IEntity';
import { IPropertyType } from '../IPropertyType';

const TypeOfVault: {
  [name: string]: TypeOfEntity;
} = {};

export function TypeOf(entity: IEntity): TypeOfEntity {

  if (TypeOfVault[entity.name] == null) {
    TypeOfVault[entity.name] = {
      entity,
      name: 'TypeOfEntity[' + entity.name + ']',
      raw: 'object',
      toDTO() {
        return Entity.instance(entity).toDTO(false);
      }
    };
  }

  return TypeOfVault[entity.name];
}

export type TypeOfEntity = IPropertyType & {
  entity: IEntity;
};