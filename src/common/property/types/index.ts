import { ArrayType } from './Array';
import { BigIntType } from './BigInt';
import { BooleanType } from './Boolean';
import { DateType } from './Date';
import { NumberType } from './Number';
import { ObjectType } from './Object';
import { StringType } from './String';

const RawTypes = {
  String : StringType,
  Number : NumberType,
  Boolean : BooleanType,
  BigInt : BigIntType,
  Array : ArrayType,
  Object : ObjectType,
  Date : DateType,
};

export {
   RawTypes as Type
} 