export type IPropertyEncode<From = unknown, To = unknown> = (value: From) => To | Promise<To>