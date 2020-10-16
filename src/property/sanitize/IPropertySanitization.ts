export interface IPropertySanitization {
  name: string;
  sanitize: PropertySanitizationFunction;
}

export type PropertySanitizationFunction = (value: any) => any;