import type { IArchiveProcedure } from '@lib/archive/procedure/IArchiveProcedure';
import type { IArchiveRequest } from '@lib/archive/procedure/request/IArchiveRequest';
import type { IArchiveResponse } from '@lib/archive/procedure/response/IArchiveResponse';
import type { IArchiveProxyResponse } from '@lib/archive/proxy/IArchiveProxyResponse';

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