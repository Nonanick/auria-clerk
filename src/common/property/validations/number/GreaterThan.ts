import { IPropertyValidation } from '../../../../interfaces/property/validation/IPropertyValidation';

export function GreaterThan(num : number) : IPropertyValidation<number> {
  return async (val) => {
    return val > num ? true : new Error(`Value must be greater than ${num}! Provided: ${val}`);
  }
}