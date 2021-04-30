import type { IPropertyType } from '@interfaces/property/type/IPropertyType';

export class PropertyType {

  static is(obj : any) : obj is IPropertyType {
    return true;
  }

  static from(type : IPropertyType) {

  }
}