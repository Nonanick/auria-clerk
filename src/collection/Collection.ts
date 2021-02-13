import { ModelDefaultIdentifier } from "../model/Model";
import { ModelOf } from "../model/ModelOf";
import { IFilterQuery } from '../query';

export class Collection<T = unknown> {
  private _models: {
    [identity: string]: ModelOf<T>;
    [identity: number]: ModelOf<T>;
  } = {};

  constructor(models: ModelOf<T>[]) {
    for (let model of models) {
      this._models[
        model.$entity().identifier?.name ?? ModelDefaultIdentifier.name
      ] = model;
    }
  }

  all() : ModelOf<T>[] {
    return Object.values(this._models);
  }

  filter(expression : IFilterQuery) : Collection<T> {
    throw new Error("not implemented yet");
  }

  order(orderingFn : ((a : ModelOf<T>, b : ModelOf<T>) => number)) : ModelOf<T>[] {
    return [];
  }

  size() {
    return Object.keys(this._models).length;
  }
}
