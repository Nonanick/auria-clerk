import { IArchiveRequest } from '../request/IArchiveRequest';

export interface IArchiveResponse {
  ok : boolean;
  errors : Error[];
  request : IArchiveRequest;
}