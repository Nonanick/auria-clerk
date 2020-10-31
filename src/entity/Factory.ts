import { IArchive } from '../archive/IArchive';
import { Maybe } from '../error/Maybe';
import { IPropertyIdentifier } from "../property/IProperty";
import { Entity } from './Entity';

export abstract class Factory {

  abstract get defaultIdentifier(): IPropertyIdentifier;

  abstract get archive(): IArchive;

  abstract hydrateEntity(entity: Entity): Maybe<Entity>;

  bindArchiveToProcedures(entity: Entity): Entity {

    // bind archive to entity procedures
    for (let entityProcedure in entity.proceduresFor.entity) {
      let proc = entity.proceduresFor.entity[entityProcedure];
      entity.proceduresFor.entity[entityProcedure] = {
        name: proc.name,
        execute: proc.execute.bind(this.archive)
      };
    }

    // bind archive to model procedures
    for (let modelProcedure in entity.proceduresFor.model) {
      let proc = entity.proceduresFor.model[modelProcedure];
      entity.proceduresFor.model[modelProcedure] = {
        name: proc.name,
        execute: proc.execute.bind(this.archive)
      };
    }

    return entity;
  }
}