import { IEntity } from '../../../entity/IEntity';
import { IModel } from '../../../model/IModel';
import { IArchive } from '../../IArchive';

export interface IArchiveRequest {
  archive : IArchive;
  entity : IEntity<{}>;
  models : IModel[];
  context : any;
}