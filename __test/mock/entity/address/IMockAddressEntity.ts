import { IStringProperty } from '../../../../src/common/property/types/String';
import { IEntity } from '../../../../src/interfaces/entity/IEntity';
import { MockAddressDTO } from './MockAddressDTO';

export interface IMockAddressEntity extends IEntity<MockAddressDTO> {
  properties : {
    address : IStringProperty;
    street : IStringProperty;
  }
}