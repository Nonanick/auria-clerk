import { Maybe } from '../../error/Maybe';
import { Model } from '../../model/Model';
import { Property } from '../Property';

export type PropertySetProxy<T = any> = (
  value: T,
  context: {
    property: Property,
    model: Model;
  }
) => Maybe<T>;