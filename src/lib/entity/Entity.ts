import type { IQueryFilter } from '@lib/archive/query/filter/IQueryFilter';
import type { IEntity } from '@lib/entity/IEntity';
import type { IModel } from '@lib/model/IModel';
import type { IValidateModel } from '@lib/model/validation/IValidateModel';
import type { JsonObject } from 'type-fest';
import { Model } from '../model/Model';
import { Property } from '../property/Property';

export class Entity<T extends JsonObject = JsonObject> implements IEntity<T> {

  #interface: IEntity<T>;

  #properties: Record<keyof T, Property>;

  static is(obj: any): obj is IEntity {
    return (
      typeof obj.name === 'string'
    );
  }

  get name(): string {
    return this.#interface.name;
  }

  get properties(): Record<keyof T, Property> {
    return this.#properties;
  }

  get validations() : Record<string, IValidateModel> {
    return { ...this.#interface.validations };
  }

  get defaultFilters() : Record<string, IQueryFilter> {
    return { ...this.#interface.defaultFilters };
  } 

  model(upgrade? : IModel<T>) : IModel<T> {

    const model = upgrade != null ? upgrade : new Model<T>(this);

    // Add validations
    Object.entries(this.validations).forEach(([name, validation]) => {
      model.addValidation(name, validation);
    });

    return model;
  }

  constructor(entity: IEntity) {
    this.#interface = entity;

    this.#properties = Object.entries(this.#interface.properties)
      .map(([name, propDef]) => {
        return new Property({
          name,
          ...propDef
        });
      })
      .reduce((hash, prop) => {
        return hash[prop.name] = prop;
      }, {} as any);
  }
  
}