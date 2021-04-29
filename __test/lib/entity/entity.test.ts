import { Entity } from '../../../src/lib/entity/Entity';
import { MockedEntity } from '../../mock/entity/MockedEntity';
describe('Entity class', () => {
  let mockedEntity : Entity = new Entity(MockedEntity);

  beforeEach(() => {
    mockedEntity = new Entity(MockedEntity);
  });
  
  describe('Property manipulation', () => {
    
  });

  describe('Model creation', () => {

  });
});