import { IArchive } from '@interfaces/archive/IArchive';
import { IEntity } from '@interfaces/entity/IEntity';
import { IModel } from '@interfaces/model/IModel';

export interface IArchiveRequest {
  archive : IArchive;
  entity : IEntity;
  models : IModel[];
  context : any;
}