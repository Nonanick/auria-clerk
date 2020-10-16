import { AppError } from "../../../error/AppError";
import { IPropertyType } from "../IPropertyType";

export const DateType: IPropertyType = {
  name: 'Date',
  raw: Date,
  encode(v: any): Date { return v instanceof Date ? v : new Date(v); },
  validate: {
    name: 'Expects a Date',
    validate: (v: any) => v instanceof Date ? true : new AppError('Date expects an instance of Date'),
  },

};