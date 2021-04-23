import type { MaybePromise } from '@error/MaybePromise';
import type { IModel } from '@lib/model/IModel';
import type { IValidateModel } from '@lib/model/validation/IValidateModel';
import type { JsonValue, JsonObject } from 'type-fest';
import { Entity } from '../entity/Entity';
import { Property } from '../property/Property';

export class Model implements IModel {

  #entity: Entity;

  #modelValidations: {
    [name: string]: IValidateModel
  } = {};

  #values: JsonObject = {};

  #properties: {
    [name: string]: Property
  } = {};

  #changedProperties: string[] = [];

  addProperty(...properties: Property[]) {
    properties.forEach(p => {
      this.#properties[p.name] = p;
    });
  }

  properties(): { [name: string]: Property; } {
    return { ...this.#properties };
  }

  constructor(entity: Entity) {
    this.#entity = entity;
  }

  async get(property: string): MaybePromise<JsonValue>;
  async get(properties: string[]): MaybePromise<JsonObject>;
  async get(properties: string | string[]): MaybePromise<JsonObject | JsonValue> {

    if (typeof properties === 'string') {
      if (this.#properties[properties] != null) {
        return this.getPropertyValue(properties);
      } else {
        return new Error(`Property ${properties} is not defined inside of model ${this.#entity.name}`)
      }
    }

    if (Array.isArray(properties)) {
      const getValuesResponse: any = {};
      const unknownProperties: string[] = [];
      for (let prop in properties) {
        if (this.#properties[prop] != null) {
          getValuesResponse[prop] = await this.getPropertyValue(prop);
        } else {
          unknownProperties.push(prop);
        }
      }

      return unknownProperties.length > 0
        ? new Error(`Properties [ ${unknownProperties.join(', ')} ] of model ${this.#entity.name} are not defined!`)
        : getValuesResponse;
    }

    return null;
  }

  private async getPropertyValue(property: string) {
    if (this.#values[property] != null) {
      return this.#values[property];
    }

    const defValue = this.properties()[property].default;
    if (defValue != null) {
      return defValue;
    }

    return null;
  }

  async set(property: string, value: JsonValue): MaybePromise<IModel, Error>;
  async set(values: { [property: string]: JsonValue; }): MaybePromise<IModel, Error[]>;
  async set(property: any, value?: JsonValue): MaybePromise<IModel, Error | Error[]> {

    if (typeof property === "string") {

      const setReturn = await this.set({
        [property]: value!
      });

      if (Array.isArray(setReturn) && setReturn[0] instanceof Error) {
        return setReturn[0];
      }
      return setReturn;
    }

    const setErrors: Error[] = [];
    let setValues: JsonObject = {};

    for (let propName in property) {
      if (this.#properties[propName] == null) {
        setErrors.push(
          new Error(`Property ${propName} is unknown in model of ${this.#entity.name}!`)
        );
        continue;
      }

      const prop = this.#properties[propName];

      let value = property[propName];

      // Apply sanitizers
      if (Object.keys(prop.sanitizers!).length > 0) {
        for (let sanitizerName in prop.sanitizers!) {
          let sanitizedValue = prop.sanitizers![sanitizerName](value);
          if (sanitizedValue instanceof Error) {
            setErrors.push(
              new Error(
                `ERROR! Failed to set value of property ${propName} in model of ${this.#entity.name}!`
                + `\n${sanitizedValue.message}`
              )
            );
            continue;
          }
          value = sanitizedValue;
        }
      }

      // Apply validations
      if (Object.keys(prop.validations!).length > 0) {

        for (let validationName in prop.validations!) {
          const validationResult = await prop.validations![validationName](value);

          if (validationResult instanceof Error) {
            setErrors.push(
              new Error(
                `ERROR! Failed to set value of property ${propName} in model of ${this.#entity.name}!`
                + `\n${validationResult.message}`
              )
            );
            continue;
          }

          setValues[propName] = value;
        }
      }
    }

    // Has errors, return them and abort
    if (setErrors.length > 0) {
      return setErrors;
    }

    // No errors apply changes
    for (let setProp in setValues) {
      if (this.#values[setProp] != setValues[setProp]) {
        this.#changedProperties.push(setProp);
        this.#values[setProp] = setValues[setProp];
      }
    }

    return this;

  }

  addValidation(name: string, validation: IValidateModel) {

    if (!this.#modelValidations[name] != null) {
      this.#modelValidations[name] = validation;
    }

    return this;
  }

  hasValidation(name: string): boolean {
    return this.#modelValidations[name] != null;
  }

  removeValidation(name: string): IValidateModel | undefined {
    const oldVal = this.#modelValidations[name];
    delete this.#modelValidations[name];
    return oldVal;
  }

  async validate(): MaybePromise<true, Error[]> {
    throw new Error('Method not implemented.');
  }

  async serialize(noDefaults?: boolean): Promise<JsonObject> {
    throw new Error('Method not implemented.');
  }

  async unserialize(json: JsonObject): Promise<IModel> {
    throw new Error('Method not implemented.');
  }

  clone(): Model {
    const clonedModel = new Model(this.#entity);
    clonedModel.#properties = {...this.#properties};
    clonedModel.#modelValidations = {...this.#modelValidations};
    clonedModel.#values = {...this.#values};

    throw new Error('Method not implemented.');
  }

}