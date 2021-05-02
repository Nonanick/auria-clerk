import { Type } from '../../../../src/common/property/types';
import { IMockAddressEntity } from './IMockAddressEntity';

export const MockedAddress : IMockAddressEntity = {
  name : 'sub_entity',
  properties : {
    address : Type.String(),
    street : Type.String(),
  }
};