import type { IModel } from '@interfaces/model/IModel';

export type ModelAddedListener = (addedModels : IModel[]) => Promise<void>;