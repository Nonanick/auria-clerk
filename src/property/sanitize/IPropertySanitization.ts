export interface IPropertySanitization<T = any> {
  name: string;
  sanitize: PropertySanitizationFunction<T>;
}

export type PropertySanitizationFunction<T = any> = (value: T) => any;