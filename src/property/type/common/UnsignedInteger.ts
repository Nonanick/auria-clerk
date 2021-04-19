import { IPropertyType } from "../IPropertyType";

export const UnsignedInteger: IPropertyType = {
  name: 'UnsignedInteger',
  raw: 'number',
  encode: (v: any) => Math.abs(parseInt(v)),
  toDTO() {
    return 'number';
  }
};