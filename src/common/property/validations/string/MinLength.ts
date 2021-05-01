import { IPropertyValidation } from '../../../../interfaces/property/validation/IPropertyValidation';

export function MinLength(min: number): IPropertyValidation<string> {
  return async (str) => {
    if (String(str).length < min) {
      return new Error('Value must be at least ' + min + ' long');
    }
    return true;
  }
}