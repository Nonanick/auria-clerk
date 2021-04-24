import { JsonObject } from 'type-fest';

export interface IEntity<T extends JsonObject = JsonObject> {
  name : string;
}