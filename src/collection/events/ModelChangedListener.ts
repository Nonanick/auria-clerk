import { IModel } from '../../interfaces/model/IModel';

export interface ModelChangedDetail {
  model : IModel;
  changedProperties : string[];
}

export type ModelChangedListener = (changedModelsDetail : ModelChangedDetail[]) => Promise<void>;