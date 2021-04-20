import { Entity } from '../entity/Entity';
import { ModelOf } from '../model/ModelOf';
import { QueryRequest } from './QueryRequest';

export class QueryResponse<T = {}> {

  protected _request: QueryRequest<T>;

  protected _rows: any[] = [];

  protected _errors: Error[] = [];

  get successful() {
    return this._errors.length === 0;
  }

  constructor(request: QueryRequest<T>) {
    this._request = request;
  }

  addRows(...rows: any[]) {
    this._rows = [...this._rows, ...rows];
    return this;
  }

  addErrors(...error: Error[]) {
    this._errors.push(...error);
    return this;
  }

  async rowsAsModels<T = unknown>(forEntity: Entity) {
    return Promise.all(
      this._rows.map(row => {
        let model = forEntity.model();
        for (let prop in row) {
          model.$set(prop, row[prop]);
        }
        return model as ModelOf<T>;
      })
    );
  }

  rows() {
    return [...this._rows];
  }

  rowsWithPublicProps(forEntity: Entity) {

    let publicProps = Object.entries(forEntity.properties)
      .filter(([_, prop]) => !prop.isPrivate())
      .map(([name]) => name);

    return this._rows.map(row => {
      let newRow: any = {};
      for (let prop of publicProps) {
        newRow[prop] = row[prop];
      }
      return newRow;
    });
  }
}