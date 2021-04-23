import { IEntity } from '@lib/entity/IEntity';

export class Entity implements IEntity {
  #interface : IEntity;

  get name() : string {
    return this.#interface.name;
  }

  constructor(entity : IEntity) {
    this.#interface = entity;
  }
}