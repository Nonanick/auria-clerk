import { Except } from 'type-fest';
import { IPropertySanitizer } from './sanitizer/IPropertySanitizer';
import { IPropertySerializer } from './serialize/IPropertySerializer';
import { IPropertyUnserializer } from './serialize/IPropertyUnserializer';
import { IPropertyType } from './type/IPropertyType';
import { IPropertyValidation } from './validation/IPropertyValidation';

export interface IProperty {
  name: string;
  type: IPropertyType | Symbol;

  required?: boolean;
  descriptive?: boolean;
  private?: boolean;
  identifier?: boolean;
  nullable?: boolean;

  sanitizers?: {
    [name: string]: IPropertySanitizer<any>;
  };

  validations?: {
    [name: string]: IPropertyValidation<any>;
  };

  serializer?: IPropertySerializer<string, any>;

  unserializer?: IPropertyUnserializer<any, string>;

  default?: null | undefined | any | (() => any | null) | (() => Promise<any | null>);

}

export type INamelessProperty = Except<IProperty, "name">;