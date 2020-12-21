import { IPropertyType } from '../IPropertyType';

const ArrayOfVault: {
  [name: string]: ArrayOfType;
} = {};

type ArrayOfType = IPropertyType & { items: IPropertyType; };

export function ArrayType(item: IPropertyType): ArrayOfType {

  if (ArrayOfVault[item.name] == null) {
    ArrayOfVault[item.name] = {
      name: 'ArrayOf[' + item.name + ']',
      raw: Array,
      items: item,
    };
  }

  return ArrayOfVault[item.name];

};