import { ArrayType } from './Array';
import { BigIntType } from './BigInt';
import { BooleanType } from './Boolean';
import { DateType } from './Date';
import { EntityType } from './EntityType';
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
  Entity : EntityType,
};

export {
   RawTypes as Type
} 