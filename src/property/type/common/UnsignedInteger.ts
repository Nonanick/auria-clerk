import { IPropertyType } from "../IPropertyType";

export const UnsignedInteger: IPropertyType = {
  name: 'UnsignedInteger',
  raw: Number,
  encode: (v: any) => Math.abs(parseInt(v)),

};