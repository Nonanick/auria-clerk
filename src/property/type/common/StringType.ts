import { AppError } from "../../../error/AppError";
import { IPropertyType } from "../IPropertyType";

export const StringType: IPropertyType & Partial<IStringType> = {
  name: 'String',
  raw: 'string',
  encode: (v: any) => String(v),
  validate: {
    name: 'Expects string',
    validate: (v: any) => typeof v === "string" ? true : new AppError('String type expects a string value!'),
  },
};

export type IStringType = {
  minLength: number;
  maxLength: number;
  pattern: string;
  format: typeof StringTypeFormat[number];
};

export const StringTypeFormat = ["time", "date", "date-time", "uri", "email", "hostname", "ipv4", "ipv6", "regex"] as const;