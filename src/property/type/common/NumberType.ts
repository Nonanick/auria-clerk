import { InvalidProperty } from '../../../error/type/InvalidProperty';
import { IPropertyType } from '../IPropertyType';

export const NumberType: IPropertyType & Partial<INumberType> = {
  name: 'Number',
  raw: 'number',
  sanitize: {
    name: 'Transform in number',
    sanitize: (value: any) => Number(value),
  },
  validate: {
    name: 'Is a number',
    validate: (value) => typeof value === 'number'
      ? true
      : new InvalidProperty("Property expected numeric value!")
  },
  toDTO() {
     return 'number';
  }
};

export type INumberType = {
  multipleOf: number;
  maximum: number;
  exclusiveMaximum: number;
  minimum: number;
  exclusiveMinimum: number;
};