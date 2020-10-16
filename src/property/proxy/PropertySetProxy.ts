import { Maybe } from '../../error/Maybe';
import { Model } from '../../model/Model';
import { Property } from '../Property';

export type PropertySetProxy = (
  value: any,
  context: {
    property: Property,
    model: Model;
  }
) => Maybe<any>;