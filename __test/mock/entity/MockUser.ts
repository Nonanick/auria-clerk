import { Type } from '../../../src/common/property/types';
import { MockedAddress } from './MockAddress';
import { sculptEntity } from '../../../src/lib/entity/Entity';

export const MockedUser = sculptEntity({
  name: '',
  properties: {
    name: Type.String(),
    isValid: Type.Boolean(),
    birthday: Type.Date(),
    address: Type.Array({
      item: Type.Entity({
        entity: MockedAddress
      }),
    }),
  },
});