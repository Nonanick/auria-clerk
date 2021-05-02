import { Model } from '../../../src/lib/model/Model';
import { Entity } from '../../../src/lib/entity/Entity';
import { MockedUser } from '../../mock/entity/user/MockUser';
import { MockUserDTO } from '../../mock/entity/user/MockUserDTO';

describe('Model class', () => {
  let mockedEntity = new Entity<MockUserDTO>(MockedUser);
  let mockedModel;

  beforeEach(() => {
    mockedModel = mockedEntity.model();
  });

  describe('Model Property manipulation', () => {

  });

  describe('Model creation', () => {

  });
});