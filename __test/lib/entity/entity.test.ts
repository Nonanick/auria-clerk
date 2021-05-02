import { Entity } from '../../../src/lib/entity/Entity';
import { IMockedUserEntity } from '../../mock/entity/user/IMockUserEntity';
import { MockedUser } from '../../mock/entity/user/MockUser';
import { MockUserDTO } from '../../mock/entity/user/MockUserDTO';

describe('Entity class', () => {
  let mockedEntity  = new Entity<MockUserDTO>(MockedUser) as IMockedUserEntity;

  beforeEach(() => {
    mockedEntity.properties.address.item.type
  });
  
  describe('Property manipulation', () => {
    
  });

  describe('Model creation', () => {

  });
});