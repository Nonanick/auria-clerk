import type { IModel } from '@lib/model/IModel';

export interface ModelChangedDetail {
  model : IModel;
  changedProperties : string[];
}

export type ModelChangedListener = (changedModelsDetail : ModelChangedDetail[]) => Promise<void>;