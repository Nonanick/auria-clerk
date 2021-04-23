import { IArchive } from '@lib/archive/IArchive';
import { IEntity } from '@lib/entity/IEntity';
import { IModel } from '@lib/model/IModel';

export interface IArchiveRequest {
  archive : IArchive;
  entity : IEntity;
  models : IModel[];
  context : any;
}