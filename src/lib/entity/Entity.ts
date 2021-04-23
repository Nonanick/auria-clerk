import type { IEntity } from '@lib/entity/IEntity';

export class Entity implements IEntity {
  
  #interface : IEntity;

  static is(obj : any) : obj is IEntity {
    return (
      typeof obj.name === 'string'
    );
  }

  get name() : string {
    return this.#interface.name;
  }

  constructor(entity : IEntity) {
    this.#interface = entity;
  }
}