import { Maybe, MaybePromise } from "../../error/Maybe";
import { IModel } from "../IModel";

export interface IModelValidation {
  name: string;
  validation: ModelValidationFunction;
}

export type ModelValidationFunction = (model: IModel) => Maybe<true> | MaybePromise<true>;