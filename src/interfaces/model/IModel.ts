import type { MaybePromise } from '@error/MaybePromise';
import type { IProperty } from '@lib/property/IProperty';
import type { JsonObject } from 'type-fest';
import type { IValidateModel } from './validation/IValidateModel';

export interface IModel<T extends JsonObject = JsonObject> {

  properties(): Record<keyof T, IProperty>

  get(property: keyof T): MaybePromise<T[typeof property]>;
  get(properties: (keyof T)[]): MaybePromise<
    Record<typeof properties[number], T[typeof properties[number]]>
  >;

  set(property: keyof T, value: T[typeof property]): MaybePromise<IModel<T>, Error[]>;
  set(values: {
    [property in keyof T]?: T[property]
  }): MaybePromise<IModel<T>, Error[]>;

  addValidation(name: string, fn: IValidateModel): IModel<T>;
  removeValidation(name: string): IValidateModel | undefined;

  changedProperties(setChanged? : (keyof T)[]): (keyof T)[];
  
  validate(): MaybePromise<true, Error[]>;

  serialize(noDefaults?: boolean): Promise<T>;
  unserialize(json: JsonObject): Promise<IModel<T>>;

  clone(): IModel<T>;
}