import { MaybePromise } from '@error/MaybePromise';
import { ArchiveEntity } from 'src/archive/entity/ArchiveEntity';
import { Class, JsonObject } from 'type-fest';
import { IArchiveModel } from '../model/IArchiveModel';
import { IArchiveResponse } from './response/IArchiveResponse';

export interface ProcedureClass extends Class<ArchiveEntity> {
  [name : string] : ProcedureClassFunction;
}

export type ProcedureClassFunction<T extends JsonObject = JsonObject> = (models : IArchiveModel<T>[]) => MaybePromise<IArchiveResponse>;

export type ProcedureModelFunction = () => MaybePromise<IArchiveResponse>;