import type { IEntity } from '@lib/entity/IEntity';
import { JsonObject } from 'type-fest';

export class Entity<T extends JsonObject = JsonObject> implements IEntity<T> {
  
  #interface : IEntity<T>;

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