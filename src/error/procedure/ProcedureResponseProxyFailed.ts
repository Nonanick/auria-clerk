import { IArchiveProcedure } from '../../interfaces/archive/procedure/IArchiveProcedure';
import { IArchiveRequest } from '../../interfaces/archive/procedure/request/IArchiveRequest';
import { IArchiveResponse } from '../../interfaces/archive/procedure/response/IArchiveResponse';
import { IArchiveProxyResponse } from '../../interfaces/archive/proxy/IArchiveProxyResponse';

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