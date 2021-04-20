import { Maybe, MaybePromise } from "../../error/Maybe";
import { Model } from '../../model/Model';
import { IProperty } from '../IProperty';

export interface IPropertyValidation<T = any> {
  name: string;
  validate: PropertyValidationFunction<T>;
}

export type PropertyValidationFunction<T = any> = (
  value: T | null | undefined,
  context?: PropertyValidationContext
) => Maybe<true> | MaybePromise<true>;

export interface PropertyValidationContext {
  property: IProperty;
  model: Model;
}

export function normalizePropertyValidation(
  validation: IPropertyValidation | IPropertyValidation[] | PropertyValidationFunction
): PropertyValidationFunction {
  let fn: PropertyValidationFunction;
  if (typeof validation === "function") {
    fn = validation;
  } else if (Array.isArray(validation)) {
    fn = async (value, context) => {
      for (let val of validation) {
        let isValid = await val.validate(value, context);
        if (isValid instanceof Error) {
          return isValid;
        }
      }

      return true as true;
    };
  } else {
    fn = validation.validate;
  }

  return fn;

}