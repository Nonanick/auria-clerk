import { IHookProcedure } from '../hook/IHookProcedure';

export type ArchiveProcedureHook = IHookProcedure & {
  targetedEntity?: string | string[];
};