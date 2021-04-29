import type { IEntity } from '../../../src/interfaces/entity/IEntity';
import type { MockedEntityDTO } from '../MockedEntityDTO';
import { Type } from '../../../src/common/property/types';

export const MockedEntity: IEntity<MockedEntityDTO> = {
  name : "mocked",
  properties : {
    name : Type.String(),
    isValid : Type.Boolean(),
    age : Type.Number(),
    birthday : Type.Date(),
    shouldValidate : Type.Boolean(),
  }
}