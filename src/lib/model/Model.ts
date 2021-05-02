import type {  JsonObject } from 'type-fest';
import { MaybePromise } from '../../error/MaybePromise';
import { IModel } from '../../interfaces/model/IModel';
import { IValidateModel } from '../../interfaces/model/validation/IValidateModel';
import { Entity } from '../entity/Entity';
import { Property } from '../property/Property';

export class Model<
Type extends {} = JsonObject,
> implements IModel<Type> {

  static is(obj : any) : obj is IModel<{}> {
    return (
      typeof obj.addProperty === 'function'
      && typeof obj.properties === 'function'
      && typeof obj.changedProperties === 'function'
      && typeof obj.get === 'function'
      && typeof obj.getPropertyValue === 'function'
      && typeof obj.set === 'function'
      && typeof obj.setPropertyValue === 'function'
      && typeof obj.addValidation === 'function'
      && typeof obj.hasValidation === 'function'
      && typeof obj.removeValidation === 'function'
      && typeof obj.validate === 'function'
      && typeof obj.serialize === 'function'
      && typeof obj.unserialize === 'function'
      && typeof obj.clone === 'function'
    )
  }

  #entity: Entity<Type>;

  #modelValidations: {
    [name: string]: IValidateModel
  } = {};

  #properties: Record<keyof Type, Property>;

  #changedProperties: (keyof Type)[] = [];

  #values: JsonObject = {};

  constructor(entity: Entity<Type>) {
    this.#entity = entity;
    this.#properties = this.#entity.properties;
  }

  addProperty(...properties: Property[]) {
    properties.forEach(p => {
      this.#properties[p.name as keyof Type] = p;
    });
  }

  properties(): Record<keyof Type, Property> {
    return { ...this.#properties };
  }

  changedProperties(setChanged? : (keyof Type)[]): (keyof Type)[] {
    
    if(setChanged != null) {
      setChanged.forEach(p => {
        if(!this.#changedProperties.includes(p)) {
          this.#changedProperties.push(p);
        }
      });
    }
    return [...this.#changedProperties];
  }

  async get(property: keyof Type): MaybePromise<
    Type[typeof property]
  >;

  async get(properties:(keyof Type)[]): MaybePromise<
  Record<typeof properties[number], Type[typeof properties[number]]>
  >;

  async get(properties: keyof Type | (keyof Type)[]) : 
  MaybePromise<
    Type[typeof properties[number]] 
    | Record<typeof properties[number], Type[typeof properties[number]]>
    | undefined
  > {

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
        if (this.#properties![prop] != null) {
          getValuesResponse[prop] = await this.getPropertyValue(prop);
        } else {
          unknownProperties.push(prop);
        }
      }

      return unknownProperties.length > 0
        ? new Error(`Properties [ ${unknownProperties.join(', ')} ] of model ${this.#entity.name} are not defined!`)
        : getValuesResponse;
    }

    return;
  }

  private async getPropertyValue(property: keyof Type) {
    if (this.#values[property] != null) {
      return this.#values[property];
    }

    const defValue = this.properties()[property].default;
    if (defValue != null) {
      return defValue;
    }

    return null;
  }

  async set(property: keyof Type, value: Type[typeof property]): MaybePromise<IModel<Type>, Error[]>;
  async set(values: { [property in keyof Type]?: Type[property]; }): MaybePromise<IModel<Type>, Error[]>;
  async set(
    property: { [property in keyof Type]?: Type[property]; } | keyof Type, 
    value?: Type[keyof Type]
    ): MaybePromise<IModel<Type>, Error | Error[]> {

    if (typeof property === "string") {

      const setReturn = await this.set({
        [property]: value!
      } as any);
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

      let value = property[propName];
      let setRet = await this.setPropertyValue(propName, value);
      if (setRet !== true) {
        setErrors.push(...setRet);
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

  private async setPropertyValue(property: keyof Type, value: Type[typeof property] | undefined): MaybePromise<true, Error[]> {
    const prop = this.#properties[property];
    const setErrors: Error[] = [];
    // Apply sanitizers
    if (Object.keys(prop.sanitizers!).length > 0) {

      for (let sanitizerName in prop.sanitizers!) {
        let sanitizedValue = prop.sanitizers![sanitizerName](value);
        if (sanitizedValue instanceof Error) {
          setErrors.push(
            new Error(
              `ERROR! Failed to set value of property ${property} in model of ${this.#entity.name}!`
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
              `ERROR! Failed to set value of property ${property} in model of ${this.#entity.name}!`
              + `\n${validationResult.message}`
            )
          );
          continue;
        }

      }
    }
    if (setErrors.length > 0) {
      return setErrors;
    }

    this.#values[property] = value;
    return true;
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

  async serialize(noDefaults?: boolean): Promise<Type> {
    throw new Error('Method not implemented.');
  }

  async unserialize(json: JsonObject): Promise<IModel<Type>> {
    throw new Error('Method not implemented.');
  }

  clone(): Model<Type> {
    const clonedModel = new Model(this.#entity);
    clonedModel.#properties = { ...this.#properties };
    clonedModel.#modelValidations = { ...this.#modelValidations };
    clonedModel.#values = { ...this.#values };

    throw new Error('Method not implemented.');
  }

}