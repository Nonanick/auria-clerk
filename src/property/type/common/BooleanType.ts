import { AppError } from "../../../error/AppError";
import { IPropertyType } from "../IPropertyType";

export const BooleanType: IPropertyType = {
  name: 'Boolean',
  raw: Boolean,
  encode: (v: any) => Boolean(v),
  validate: {
    name: 'Expects boolean',
    validate: (v: any) => typeof v === "boolean" ? true : new AppError('Boolean type expects value to be a boolean!')
  }
};