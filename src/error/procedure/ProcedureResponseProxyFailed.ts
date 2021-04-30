import type { IArchiveProcedure } from '@interfaces/archive/procedure/IArchiveProcedure';
import type { IArchiveRequest } from '@interfaces/archive/procedure/request/IArchiveRequest';
import type { IArchiveResponse } from '@interfaces/archive/procedure/response/IArchiveResponse';
import type { IArchiveProxyResponse } from '@interfaces/archive/proxy/IArchiveProxyResponse';

export class ProcedureResponseProxyFailed extends Error {

  constructor(
    public proxy: IArchiveProxyResponse,
    public procedureName : string | Symbol,
    public procedure: IArchiveProcedure,
    public response : IArchiveResponse,
    public request: IArchiveRequest,

  ) {
    super();
  }
}