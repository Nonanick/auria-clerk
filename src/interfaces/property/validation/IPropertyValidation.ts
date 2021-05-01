import { MaybePromise } from '../../../error/MaybePromise';

export type IPropertyValidation<T>  = (data : T) => MaybePromise<true>;