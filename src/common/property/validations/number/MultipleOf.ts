import { IPropertyValidation } from '@interfaces/property/validation/IPropertyValidation';

export function MultipleOf(num : number) : IPropertyValidation<number> {
  return async (val) => {
    return val%num === 0 ? true : new Error(`Value ${val} is not a multiple of ${num}!`);
  }
}