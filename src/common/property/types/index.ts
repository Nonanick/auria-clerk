import { ArrayType } from './Array';
import { BigIntType } from './BigInt';
import { BooleanType } from './Boolean';
import { NumberType } from './Number';
import { ObjectType } from './Object';
import { StringType } from './String';

const RawTypes = {
  String : StringType,
  Number : NumberType,
  Boolean : BooleanType,
  BigInt : BigIntType,
  Array : ArrayType,
  Object : ObjectType
};

export {
   RawTypes as Type
} 