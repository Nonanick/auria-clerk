import { JsonObject } from 'type-fest';
import { IArchiveModel } from '../../interfaces/archive/model/IArchiveModel';
import { IArchiveProcedure } from '../../interfaces/archive/procedure/IArchiveProcedure';
import { ProcedureClassFunction, ProcedureModelFunction } from '../../interfaces/archive/procedure/ProcedureClass';
import type { ArchiveEntity } from '../entity/ArchiveEntity';
import { RunProcedure } from './RunProcedure';

export function AddProcedure<
  Model extends JsonObject = JsonObject,
  Entity extends ArchiveEntity<Model> = ArchiveEntity<Model>,
  Procedures extends { [name: string]: IArchiveProcedure; } = { [name: string]: IArchiveProcedure; }
>(target: Entity, procedures: Procedures) {

  let entityWithProcedures: any = target;

  for (let procedureName in procedures) {
    entityWithProcedures[procedureName] = async (
      models: IArchiveModel<Model>[],
      context?: any
    ) => {
      return RunProcedure(
        procedureName,
        procedures[procedureName],
        target.archive(),
        target,
        models,
        context
      );
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
