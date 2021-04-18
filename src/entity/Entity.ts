import type { Except } from 'type-fest';
import { MaybePromise } from "../error/Maybe";
import { Model } from "../model/Model";
import { ModelOf } from "../model/ModelOf";
import type { IModelValidation } from "../model/validate/IModelValidation";
import type {
  IProperty,
  IPropertyIdentifier,
  ValidPropertyType
} from "../property/IProperty";
import { Property } from "../property/Property";
import { isPropertyType } from "../property/type/IPropertyType";
import type { IFilterQuery } from "../query/filter/IFilterQuery";
import type { IOrderBy } from "../query/order/IOrderBy";
import type { IEntity, PropertyInDictionary } from "./IEntity";

export class Entity<T = unknown> {

  private static instances: {
    [name: string]: Entity;
  } = {};

  static instance<T = unknown>(entity: IEntity): Entity<T> {
    if (Entity.instances[entity.name] == null) {
      Entity.instances[entity.name] = new Entity(entity);
    }
    return Entity.instances[entity.name];
  }

  static define<T extends IEntity = IEntity>(entity: T): IEntity & {
    readonly [key in keyof T]: T[key] } {
    return { ...entity } as const;
  }

  protected _entity: IEntity;

  protected _properties: {
    [name: string]: Property;
  } = {};

  get name(): string {
    return this._entity.name;
  }

  get filters(): IFilterQuery {
    return this._entity.filters ?? {};
  }

  hasFilters(): boolean {
    let keys = Object.keys(this.filters);
    return keys.length > 0;
  }

  get orderBy(): IOrderBy | undefined {
    return this._entity.orderBy != null
      ? typeof this._entity.orderBy === "string"
        ? { property: this._entity.orderBy }
        : { ...this._entity.orderBy }
      : undefined;
  }

  hasOrdering(): boolean {
    return this.orderBy != null;
  }

  get identifier(): IPropertyIdentifier | undefined {
    return this._entity.identifier;
  }

  get source(): string {
    return this._entity.source ?? this._entity.name;
  }

  get properties(): { [name: string]: Property; } {
    return {
      ...this._properties
    };
  }

  private initProperties(props: {
    [name: string]: PropertyInDictionary | ValidPropertyType;
  }) {
    let hasUnique = false;

    for (let propName in props) {
      let mustBeProp: ValidPropertyType | PropertyInDictionary =
        this._entity.properties[propName];

        let fullProp : IProperty;
      if (
        isPropertyType(mustBeProp) ||
        (
          typeof mustBeProp === "string"
          && ['string', 'number', 'boolean', 'bool', 'object', 'date', 'array'].includes(mustBeProp)
        )
      ) {
        fullProp = {
          name: propName,
          type: mustBeProp as ValidPropertyType,
        };
      } else {
        fullProp = {
          name: propName,
          ...mustBeProp as (PropertyInDictionary),
        };
      }

      this._properties[propName] = new Property(fullProp);

      if (this._properties[propName].isUnique()) {
        hasUnique = true;
      }
    }
    return hasUnique;
  }

  constructor(init: IEntity) {
    this._entity = init;

    // Properties
    if (init.identifier != null) {
      let idProp = new Property(init.identifier as IProperty);
      this._properties[idProp.name] = idProp;
    }

    this.initProperties(init.properties);
  }

  hasUnique(): boolean {
    return Object.entries(this._properties)
      .filter(([name, prop]) => prop.isUnique())
      .length > 0;
  }

  model<DTO = T>(): ModelOf<DTO> {
    let model = new Model<DTO>(this);

    return model as ModelOf<DTO>;
  };

  // Apply all validations to model
  async validate(model: Model): MaybePromise<true> {
    if (this._entity.validate == null) {
      return true;
    }
    let validations: IModelValidation[] = [];

    if (!Array.isArray(this._entity.validate)) {
      validations = [this._entity.validate];
    } else {
      validations = this._entity.validate;
    }

    for (let validation of validations) {
      let isValid = validation.validation(model);

      while (isValid instanceof Promise) {
        isValid = await isValid;
      }

      if (isValid instanceof Error) {
        return isValid;
      }
    }

    return true as true;
  }
}
