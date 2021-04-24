import type { IQueryFilter } from '@lib/archive/query/filter/IQueryFilter';
import type { IQueryOrder } from '@lib/archive/query/order/IQueryOrder';
import type { IModel } from '@lib/model/IModel';
import type { ModelAddedListener } from './events/ModelAddedListener';
import type { ModelChangedListener } from './events/ModelChangedListener';
import type { ModelRemovedListener } from './events/ModelRemovedListener';

export class Collection {

  #name: string;

  #models: IModel[] = [];

  #filters: IQueryFilter[] = [];

  #sorting: IQueryOrder[] = [];

  #listeners: {
    add: ModelAddedListener[];
    remove: ModelRemovedListener[];
    changed: ModelChangedListener[];
  } = {
      add: [],
      remove: [],
      changed: []
    };

  constructor(name?: string) {
    this.#name = name ?? "Unnamed";
  }

  add(...models: IModel[]) {
    let addedModels: IModel[] = [];

    models.forEach(m => {
      if (!this.#models.includes(m)) {
        this.#models.push(m);
        addedModels.push(m);
      }
    });

    this.trigger('add', addedModels);
  }

  remove(...models: IModel[]) {
    let removedModels: IModel[] = [];

    this.#models = this.#models
      .filter(m => {
        if (models.includes(m)) {
          removedModels.push(m);
          return false;
        }
        return true;
      });

    this.trigger('remove', removedModels);
  }

  onModelAdded(listener: ModelAddedListener): void {
    if (!this.#listeners.add.includes(listener)) {
      this.#listeners.add.push(listener);
    }
  }

  offModelAdded(listener: ModelAddedListener): void {
    this.#listeners.add = this.#listeners.add.filter(l => l != listener);
  }

  onModelRemoved(listener: ModelRemovedListener): void {
    if (!this.#listeners.remove.includes(listener)) {
      this.#listeners.remove.push(listener);
    }
  }

  offModelRemoved(listener: ModelRemovedListener): void {
    this.#listeners.remove = this.#listeners.remove.filter(l => l != listener);
  }

  onModelChanged(listener: ModelChangedListener): void {
    if (!this.#listeners.changed.includes(listener)) {
      this.#listeners.changed.push(listener);
    }
  }

  offModelChanged(listener: ModelChangedListener): void {
    this.#listeners.changed = this.#listeners.changed.filter(l => l != listener);
  }

  removeAllListeners() {
    this.#listeners = {
      add: [],
      remove: [],
      changed: []
    };
  }

  async trigger(event: 'add' | 'remove' | 'change', models: IModel[], changedProperties?: string[]): Promise<void | Error> {

    if (models.length == 0) {
      return;
    }

    // Change event and no properties were passed? All properties changed!
    if (event === 'change' && changedProperties == null) {
      changedProperties = Object.keys(models[0].properties());
    }

    try {
      switch (event) {
        case 'add':
          await Promise.all(
            this.#listeners.add.map(l => l(models))
          );
          break;
        case 'remove':
          await Promise.all(
            this.#listeners.remove.map(l => l(models))
          );
          break;
        case 'change':
          await Promise.all(
            this.#listeners.changed.map(
              listener => listener(
                models.map(model => ({ model, changedProperties: changedProperties! }))
              )
            )
          );
          break;
      }
    } catch (err) {
      return err;
    }

    return;
  }

  filter(...filters: IQueryFilter[]): Collection {
    const newCol = new Collection(this.#name);

    newCol.#filters = [...this.#filters, ...filters];
    newCol.#sorting = this.#sorting;

    newCol.add(...this.#models);

    // Replace child add and remove function to this, models will always cascade
    newCol.add = this.add.bind(this);
    newCol.remove = this.remove.bind(this);

    // TODO: Add listeners to update models to child

    return newCol;
  }

  sort(sort: IQueryOrder) {

  }

}