import { ComparableValues } from '../query';
import { Model } from "./Model";

export type ModelOf<T> = T & Model<T> & {
  $set(props: Partial<T>): boolean;
  $get(propName: keyof T): ComparableValues;
};