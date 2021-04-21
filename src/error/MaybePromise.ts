import { Maybe } from './Maybe';

export type MaybePromise<T, Err = Error> = Promise<Maybe<T, Err>>;