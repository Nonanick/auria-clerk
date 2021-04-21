import { IPropertyValidation } from '@lib/property/validation/IPropertyValidation';

export function MaxLenngth(max: number): IPropertyValidation<string> {
  return async (str) => {
    if (String(str).length >= max) {
      return new Error('Value must not be longer than ' + max + ' characters');
    }
    return true;
  }
}