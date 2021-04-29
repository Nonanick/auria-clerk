export interface MockedEntityDTO {
  name : string;
  age : number;
  isValid : boolean;
  birthday : Date;
  shouldValidate? : boolean;
}