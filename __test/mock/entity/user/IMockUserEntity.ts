import { IArrayProperty } from '../../../../src/common/property/types/Array';
import { IBooleanProperty } from '../../../../src/common/property/types/Boolean';
import { IDateProperty } from '../../../../src/common/property/types/Date';
import { IEntityProperty } from '../../../../src/common/property/types/EntityType';
import { INumberProperty } from '../../../../src/common/property/types/Number';
import { IStringProperty } from '../../../../src/common/property/types/String';
import { IEntity } from '../../../../src/interfaces/entity/IEntity';
import { IMockAddressEntity } from '../address/IMockAddressEntity';
import { MockUserDTO } from './MockUserDTO';

export interface IMockedUserEntity extends IEntity<MockUserDTO> {
  
  properties : {
    name : IStringProperty;
    age : INumberProperty;
    shouldValidate : IBooleanProperty;
    birthday : IDateProperty;
    isValid : IBooleanProperty;
    address : IArrayProperty<IEntityProperty<IMockAddressEntity>>
  };
}