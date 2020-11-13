import { InvalidProperty } from '../../../error/type/InvalidProperty';
import { IPropertyType } from '../IPropertyType';

export const NumberType: IPropertyType = {
  name: 'Number',
  raw: Number,
  sanitize: {
    name: 'Transform in number',
    sanitize: (value: any) => Number(value),
  },
  validate: {
    name: 'Is a number',
    validate: (value) => typeof value === 'number'
      ? true
      : new InvalidProperty("Property expected numeric value!")
  }
};