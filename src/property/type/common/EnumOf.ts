import { MaybePromise } from '../../../error/Maybe';
import { IPropertyType } from '../IPropertyType';

export function EnumOf(array: EnumValue[], validate?: (value: any) => MaybePromise<true>): IPropertyType {
  return {
    name: 'EnumOf',
    raw: String,
    validate: {
      name: 'Belongs to enumeration',
      validate: validate ?? (
        (value: any) => {
          return array.includes(value) ? true : new Error('Invalid value for this property');
        })
    }
  };
};

export type EnumValue = String | Number | Boolean | Object;