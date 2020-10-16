import { AppError } from "../../../error/AppError";
import { IPropertyType } from "../IPropertyType";

export const StringType: IPropertyType = {
  name: 'String',
  raw: String,
  encode: (v: any) => String(v),
  validate: {
    name: 'Expects string',
    validate: (v: any) => typeof v === "string" ? true : new AppError('String type expects a string value!'),
  },
};