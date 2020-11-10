import { Maybe, MaybePromise } from "../../error/Maybe";
import { Model } from "../Model";

export interface IModelValidation {
  name: string;
  validation: ModelValidationFunction;
}

export type ModelValidationFunction = (model: Model) => Maybe<true> | MaybePromise<true>;