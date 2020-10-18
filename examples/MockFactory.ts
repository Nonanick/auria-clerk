import { nanoid } from "nanoid";
import { Entity } from "../src/entity/Entity";
import { Factory } from "../src/entity/Factory";
import { Maybe } from "../src/error/Maybe";
import { IPropertyIdentifier } from "../src/property/IProperty";

export class MockFactory extends Factory {

  hydrateEntity(entity: Entity): Maybe<Entity> {
    return entity;
  }

  get defaultIdentifier(): IPropertyIdentifier {
    return {
      name: '_id',
      type: String,
      default: () => nanoid(),
    };
  }

}