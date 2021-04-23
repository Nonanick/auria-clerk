export type IPropertyUnserializer<From, To> = (value : From) => To | Promise<To>;
