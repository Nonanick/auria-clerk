import { IModel } from '@lib/model/IModel';

export type ModelRemovedListener = (modelsRemoved : IModel[]) => Promise<void>;