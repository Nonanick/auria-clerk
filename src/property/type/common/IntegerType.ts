import { AppError } from "../../../error/AppError";
import { IPropertyType } from "../IPropertyType";

export const IntegerType: IPropertyType = {
  name: 'Integer',
  raw: Number,
  encode: (v: any) => parseInt(v),
  validate: [{
    name: 'Is numeric',
    validate: (v: any) => typeof v === 'number' ? true : new AppError('Integer type expects a numeric value!')
  }]
};