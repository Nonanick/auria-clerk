import { IArchive } from '../archive/IArchive';
import { Maybe } from '../error/Maybe';
import { IPropertyIdentifier } from "../property/IProperty";
import { Entity } from './Entity';

export abstract class Factory {

  abstract get defaultIdentifier(): IPropertyIdentifier;

  abstract get archive(): IArchive;

  abstract hydrateEntity(entity: Entity): Maybe<Entity>;

}