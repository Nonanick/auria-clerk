import { IEntity } from "./IEntity";

function HookEntity(entity: IEntity, type: string, hook: any): IEntity {
  return entity;
}

export { HookEntity };