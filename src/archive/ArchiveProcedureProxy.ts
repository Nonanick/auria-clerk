import { IProxyProcedure } from '../proxy/IProxyProcedure';

export type ArchiveProcedureProxy = IProxyProcedure & {
  targetedEntity?: string | string[];
};