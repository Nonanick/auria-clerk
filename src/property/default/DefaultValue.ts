import { ComparableValues } from '../../query/filter/FilterComparison';
import type { JsonObject } from 'type-fest';
export type DefaultValue =
  | String
  | Number
  | Boolean
  | Date
  | JsonObject
  | Array<any>
  | null
  | (() => String | Number | Boolean | Date | JsonObject | Array<any> | null)
  | (() => Promise<String | Number | Boolean | Date | JsonObject | Array<any> | null> );

export async function ResolveDefaultValue(def: DefaultValue) {
  let value: any;

  if (typeof def === 'function') {
    value = def();
  } else {
    value = def;
  }

  if (value instanceof Promise) {
    try {
      value = await value;
    } catch (err) {
      console.error('Failed to resolve default value promise!', err);
      return undefined;
    }
  }

  return value as ComparableValues;

}
