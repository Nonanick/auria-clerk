import { Maybe, MaybePromise } from "../../error/Maybe";
import { IModel } from "../../model/IModel";
import { IProperty } from "../IProperty";

export interface IPropertyValidation {
  name: string;
  validate: PropertyValidationFunction;
}

export type PropertyValidationFunction = (value: any, context: PropertyValidationContext) => Maybe<true> | MaybePromise<true>;

export interface PropertyValidationContext {
  property: IProperty;
  model: IModel;
}