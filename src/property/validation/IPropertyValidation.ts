import { Maybe } from "../../error/Maybe";
import { Model } from '../../model/Model';
import { Property } from '../Property';

export interface IPropertyValidation {
  name: string;
  validate: PropertyValidationFunction;
}

export type PropertyValidationFunction = (value: any, context: PropertyValidationContext) => Maybe<true>;

export interface PropertyValidationContext {
  property: Property;
  model: Model;
}