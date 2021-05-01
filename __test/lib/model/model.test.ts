import { Model } from '../../../src/lib/model/Model';
import { Entity } from '../../../src/lib/entity/Entity';
import { MockedUser } from '../../mock/entity/MockUser';
import type { MockUserDTO } from '../../mock/MockUserDTO';

describe('Model class', () => {
  let mockedEntity: Entity<MockUserDTO> = new Entity(MockedUser);
  let mockedModel: Model = mockedEntity.model();

  beforeEach(() => {
    mockedModel = mockedEntity.model();
  });

  describe('Model Property manipulation', () => {

  });

  describe('Model creation', () => {

  });
});