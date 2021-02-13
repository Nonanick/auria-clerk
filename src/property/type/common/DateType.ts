import { AppError } from "../../../error/AppError";
import { IPropertyType } from "../IPropertyType";
import { IStringType } from './StringType';

export const DateType: IPropertyType & Partial<IStringType> = {
  name: 'Date',
  raw: String,
  encode(v: any): Date { return v instanceof Date ? v : new Date(v); },
  validate: {
    name: 'Expects a Date',
    validate: (v: any) => v instanceof Date ? true : new AppError('Date expects an instance of Date'),
  },
  format: "date-time"

};