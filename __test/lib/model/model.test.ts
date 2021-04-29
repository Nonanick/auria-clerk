import { Model } from '../../../src/lib/model/Model';
import { Entity } from '../../../src/lib/entity/Entity';
import { MockedEntity } from '../../mock/entity/MockedEntity';
import type { MockedEntityDTO } from '../../mock/MockedEntityDTO';

describe('Model class', () => {
  let mockedEntity: Entity = new Entity<MockedEntityDTO>(MockedEntity);
  let mockedModel: Model = mockedEntity.model();

  beforeEach(() => {
    mockedModel = mockedEntity.model();
  });

  describe('Model Property manipulation', () => {

  });

  describe('Model creation', () => {

  });
});