import { IPropertyValidation } from '@interfaces/property/validation/IPropertyValidation';
import { JsonObject } from 'type-fest';

export const HasRequiredProperties: (props: string[]) => IPropertyValidation<JsonObject> = (props) => {

  return async (obj) => {

    const properties = Object.keys(obj);
    const propertiesNotFound: string[] = [];

    for (let prop of props) {
      
      if (properties.includes(prop)) continue;

      propertiesNotFound.push(prop);
    }

    if (propertiesNotFound.length > 0) {
      return new Error('Object lacks the following properties: ' + props.map(p => `'${p}'`).join(', '));
    }

    return true;
  };
}