import type { MaybePromise } from '@error/MaybePromise';
import { IProperty } from '@lib/property/IProperty';
import type { JsonArray, JsonObject, JsonValue } from 'type-fest';

export interface IModel {

  properties() : {
    [name : string] : IProperty[]
  };

  get(property : string) : MaybePromise<JsonValue>;
  get(properties : string[]) : MaybePromise<JsonArray>;
  
  set(property : string, value : JsonValue) : MaybePromise<IModel>;
  set(values : {
    [property : string] : JsonValue
  }) : MaybePromise<IModel>;
  
  validate() : MaybePromise<true, Error[]>;
  
  serialize(noDefaults? : boolean) : Promise<JsonObject>;
  unserialize(json : JsonObject) : Promise<IModel>; 
  
}