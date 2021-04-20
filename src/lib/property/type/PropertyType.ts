import type { IPropertyType } from '@lib/property/type/IPropertyType';

export class PropertyType {

  static is(obj : any) : obj is IPropertyType {
    return true;
  }

  static from(type : IPropertyType) {

  }
}