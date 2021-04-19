import { IPropertyType } from '../IPropertyType';

const ArrayOfVault: {
  [name: string]: ArrayOfType;
} = {};

type ArrayOfType = IPropertyType & { items: IPropertyType; };

export function ArrayType(item: IPropertyType): ArrayOfType {
  if (ArrayOfVault[item.name] == null) {
    ArrayOfVault[item.name] = {
      name: 'ArrayOf[' + item.name + ']',
      raw: 'array',
      items: item,
      toDTO() {
        return `(${item.toDTO()})[]`;
      }
    };
  }

  return ArrayOfVault[item.name];

};