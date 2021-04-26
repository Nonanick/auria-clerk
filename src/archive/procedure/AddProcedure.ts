import type { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import type { IArchiveProcedure } from '@lib/archive/procedure/IArchiveProcedure';
import type { ProcedureClassFunction, ProcedureModelFunction } from '@lib/archive/procedure/ProcedureClass';
import type { JsonObject } from 'type-fest';
import type { ArchiveEntity } from '../entity/ArchiveEntity';

export function AddProcedure<
  Model extends JsonObject = JsonObject,
  Entity extends ArchiveEntity<Model> = ArchiveEntity<Model>,
  Procedures extends { [name: string]: IArchiveProcedure; } = { [name: string]: IArchiveProcedure; }
>(target: Entity, procedures: Procedures) {

  let entityWithProcedures: any = target;

  for (let procName in procedures) {
    entityWithProcedures[procName] = async (models: IArchiveModel<Model>[]) => {
      return procedures[procName](target.archive(), target, models);
    }
  }

  // Rewrite procedures() : string[], function
  let oldProcedures = entityWithProcedures.procedures();
  entityWithProcedures.procedures = () => [...oldProcedures, ...Object.keys(procedures)];

  return entityWithProcedures as {
    model(): IArchiveModel<Model> & { [procedure in keyof Procedures]: ProcedureModelFunction }
  } & Entity & {
      [procedure in keyof Procedures]: ProcedureClassFunction<Model>
    };
}
