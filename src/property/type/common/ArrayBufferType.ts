import { IPropertyType } from '../IPropertyType';

export const ArrayBufferType: IPropertyType = {
  name: 'ArrayBuffer',
  raw: ArrayBuffer,
  encode: (value) => Buffer.from(value),
};