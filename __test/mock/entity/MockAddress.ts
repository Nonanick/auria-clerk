import { Type } from '../../../src/common/property/types';
import { sculptEntity } from '../../../src/lib/entity/Entity';
import { MockAddressDTO } from '../MockAddressDTO';

export const MockedAddress = sculptEntity<MockAddressDTO>({
  name : 'sub_entity',
  properties : {
    address : Type.String(),
    street : Type.String(),
  }
});