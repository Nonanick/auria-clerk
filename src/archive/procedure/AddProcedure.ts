import type { IArchiveModel } from '@lib/archive/model/IArchiveModel';
import type { IArchiveProcedure } from '@lib/archive/procedure/IArchiveProcedure';
import type { ProcedureClassFunction, ProcedureModelFunction } from '@lib/archive/procedure/ProcedureClass';
import type { JsonObject } from 'type-fest';
import type { ArchiveEntity } from '../entity/ArchiveEntity';

export function AddProcedure<
  Model extends JsonObject = JsonObject,
  T extends ArchiveEntity<Model> = ArchiveEntity<Model>,
  Proc extends { [name: string]: IArchiveProcedure; } = { [name: string]: IArchiveProcedure; }
>(to: T, procedures: Proc) {

  let addedProcedures: any = to;

  for (let procName in procedures) {
    addedProcedures[procName] = async (models: IArchiveModel<Model>[]) => {
      return procedures[procName](to.archive(), to, models);
    }
  }

  // Rewrite procedures function
  let oldProcedures = addedProcedures.procedures();
  addedProcedures.procedures = () => [...oldProcedures, ...Object.keys(procedures)];

  return addedProcedures as {
    model(): IArchiveModel<Model> & { [procedure in keyof Proc]: ProcedureModelFunction }
  } & T & {
      [procedure in keyof Proc]: ProcedureClassFunction<Model>
    };
}
