import { OPEN_CREATE, OPEN_PRIVATECACHE, OPEN_READONLY, OPEN_READWRITE, OPEN_SHAREDCACHE, OPEN_URI } from 'sqlite3';
export interface SQLiteConnectionInfo {
  filename: string;
  openMode: OpenMode;
}

export enum OpenMode {
  create = OPEN_CREATE,
  privateCache = OPEN_PRIVATECACHE,
  readonly = OPEN_READONLY,
  readWrite = OPEN_READWRITE,
  sharedCache = OPEN_SHAREDCACHE,
  uri = OPEN_URI
}