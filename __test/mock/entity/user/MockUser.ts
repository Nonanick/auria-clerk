import { Type } from '../../../../src/common/property/types';
import { MockedAddress } from '../address/MockAddress';
import { IMockedUserEntity } from './IMockUserEntity';

export const MockedUser: IMockedUserEntity = {
  name: 'user',
  properties: {
    address: Type.Array({
      item: Type.Entity({
        entity: MockedAddress
      })
    }),
    age: Type.Number(),
    birthday: Type.Date(),
    isValid: Type.Boolean(),
    name: Type.String(),
    shouldValidate: Type.Boolean(),
  }
}
