import { MockAddressDTO } from '../address/MockAddressDTO';

export interface MockUserDTO {
  name : string;
  age : number;
  isValid : boolean;
  birthday : Date;
  shouldValidate? : boolean;
  address : MockAddressDTO[];
}