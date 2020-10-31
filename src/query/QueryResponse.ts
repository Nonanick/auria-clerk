import { Entity } from '../entity/Entity';
import { QueryRequest } from './QueryRequest';

export class QueryResponse {

  protected _request: QueryRequest;

  protected _rows: any[] = [];

  protected _errors: Error[] = [];

  get successful() {
    return this._errors.length === 0;
  }

  constructor(request: QueryRequest) {
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

  async rowsAsModels(forEntity: Entity) {
    return Promise.all(
      this._rows.map(row => {
        let model = forEntity.model();
        for (let prop in row) {
          model.$set(prop, row[prop]);
        }
        return model;
      })
    );
  }

  rows() {
    return [...this._rows];
  }
}