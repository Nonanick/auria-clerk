import { IEntity } from '@lib/entity/IEntity';
import { IArchiveModel } from '../model/IArchiveModel';

export interface IArchiveEntity extends IEntity {

  model() : IArchiveModel;
}