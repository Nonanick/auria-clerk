import { MaybePromise } from '../../../error/Maybe';
import { IPropertyType } from '../IPropertyType';

export function EnumOf(array: EnumValue[], validate?: (value: any) => MaybePromise<true>): IPropertyType {
  return {
    name: 'EnumOf',
    raw: 'string',
    validate: {
      name: 'Belongs to enumeration',
      validate: validate ?? (
        (value: any) => {
          return array.includes(value) ? true : new Error('Invalid value for this property');
        })
    },
    toDTO() {
      return array.map(v => {
        switch (typeof v) {
          case 'string':
          case 'number':
            return '"' + v + '"';
          case "boolean":
            return v;
          case "object":
            return `{ [property : string] : any}`;
        }
      }).join(' | ');
    }
  };
};

export type EnumValue = String | Number | Boolean | Object;