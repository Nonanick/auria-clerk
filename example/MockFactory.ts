import { nanoid } from "nanoid";
import { Factory } from "../src/entity/Factory";
import { IProperty, IPropertyIdentifier } from "../src/property/IProperty";

export class MockFactory extends Factory {

  get defaultIdentifier(): IPropertyIdentifier {
    return {
      name: '_id',
      type: String,
      default: () => nanoid(),
    };
  }

}