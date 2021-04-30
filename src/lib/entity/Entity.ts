import type { IQueryFilter } from '@interfaces/archive/query/filter/IQueryFilter';
import type { IEntity } from '@interfaces/entity/IEntity';
import type { IModel } from '@interfaces/model/IModel';
import type { IValidateModel } from '@interfaces/model/validation/IValidateModel';
import type { IProperty } from '@interfaces/property/IProperty';
import type { Except, JsonObject } from 'type-fest';
import { Type } from '../../common/property/types';
import { Model } from '../model/Model';
import { Property } from '../property/Property';

export class Entity<T extends {} = JsonObject> implements IEntity<T> {

  static defaultIdentifier: IProperty = {
    name: '_id',
    ...Type.String(),
  };

  #interface: IEntity<T>;

  #properties: Record<keyof T, Property>;

  static is(obj: any): obj is IEntity {
    return (
      typeof obj.name === 'string'
    );
  }

  get identifier(): IProperty {
    return this.#interface.identifier ?? Entity.defaultIdentifier;
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
          ...propDef as Except<IProperty, "name">
        });
      })
      .reduce((hash, prop) => {
        return hash[prop.name] = prop;
      }, {} as any);
  }
  
}