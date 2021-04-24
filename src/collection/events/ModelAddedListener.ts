import type { IModel } from '@lib/model/IModel';

export type ModelAddedListener = (addedModels : IModel[]) => Promise<void>;