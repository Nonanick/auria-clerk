import { IModel } from '@interfaces/model/IModel';

export type ModelRemovedListener = (modelsRemoved : IModel[]) => Promise<void>;