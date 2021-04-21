import { MaybePromise } from '@error/MaybePromise';
import { IModel } from '@lib/model/IModel';
import { IProperty } from '@lib/property/IProperty';
import { JsonValue, JsonArray, JsonObject } from 'type-fest';

export class Model implements IModel {

  private _values : JsonObject = {};

  properties(): { [name: string]: IProperty[]; } {
    throw new Error('Method not implemented.');
  }

  async get(property: string): MaybePromise<JsonValue>;
  async get(properties: string[]): MaybePromise<JsonArray>;
  async get(properties: any) : MaybePromise<JsonArray | JsonValue> {
    throw new Error('Method not implemented.');
  }

  async set(property: string, value: JsonValue): MaybePromise<IModel>;
  async set(values: { [property: string]: JsonValue; }): MaybePromise<IModel>;
  async set(property: any, value?: any): MaybePromise<IModel> {
    throw new Error('Method not implemented.');
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
  
}