export type DefaultValue =
  | String
  | Number
  | Boolean
  | ArrayBuffer
  | Date
  | (() => String | Number | Boolean | ArrayBuffer | Date)
  | (() => Promise<String | Number | Boolean | ArrayBuffer | Date>);

export async function ResolveDefaultValue(def: DefaultValue) {
  let value: any;

  if (typeof def === 'function') {
    value = def();
  } else {
    value = def;
  }

  if (value instanceof Promise) {
    try {
      value = await value;
    } catch (err) {
      console.error('Failed to resolve default value promise!', err);
      return undefined;
    }
  }

  return value;

}
