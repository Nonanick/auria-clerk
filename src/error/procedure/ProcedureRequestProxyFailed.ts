import { IArchiveProcedure } from '@lib/archive/procedure/IArchiveProcedure';
import { IArchiveRequest } from '@lib/archive/procedure/request/IArchiveRequest';
import { IArchiveProxyRequest } from '@lib/archive/proxy/IArchiveProxyRequest';

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