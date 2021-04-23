import { MaybePromise } from '@error/MaybePromise';
import { IModel } from '../IModel';

export type IValidateModel = (model : IModel) => MaybePromise<true, Error[]>;