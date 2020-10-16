import { AppError } from "./AppError";
import { AppException } from "./AppException";

export type Maybe<T> = AppError | AppException | T;
export type MaybePromise<T> = Promise<Maybe<T>>;