import type { MaybePromise } from '@error/MaybePromise';
import type { IProperty } from '@lib/property/IProperty';
import type { JsonObject, JsonValue } from 'type-fest';
import type { IValidateModel } from './validation/IValidateModel';

export interface IModel {

  properties() : {
    [name : string] : IProperty
  };

  get(property : string) : MaybePromise<JsonValue>;
  get(properties : string[]) : MaybePromise<JsonObject>;
  
  set(property : string, value : JsonValue) : MaybePromise<IModel>;
  set(values : {
    [property : string] : JsonValue
  }) : MaybePromise<IModel, Error[]>;
  
  addValidation(name : string, fn : IValidateModel) : IModel;
  removeValidation(name : string) : IValidateModel | undefined;

  validate() : MaybePromise<true, Error[]>;
  
  serialize(noDefaults? : boolean) : Promise<JsonObject>;
  unserialize(json : JsonObject) : Promise<IModel>; 
  
  clone() : IModel;
}