import { IPropertyIdentifier } from "../property/IProperty";

export abstract class Factory {

  abstract get defaultIdentifier(): IPropertyIdentifier;
}