import { IArchiveProcedure } from '@interfaces/archive/procedure/IArchiveProcedure';
import { IArchiveRequest } from '@interfaces/archive/procedure/request/IArchiveRequest';
import { IArchiveProxyRequest } from '@interfaces/archive/proxy/IArchiveProxyRequest';

export class ProcedureRequestProxyFailed extends Error {

  constructor(
    public proxy: IArchiveProxyRequest,
    public procedureName : string | Symbol,
    public procedure: IArchiveProcedure,
    public request: IArchiveRequest
  ) {
    super();
  }
}