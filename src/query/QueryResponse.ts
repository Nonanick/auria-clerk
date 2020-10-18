export class QueryResponse {

  protected _rows: any[] = [];

  constructor() {


  }

  addRows(rows: any[]) {
    this._rows = [...this._rows, ...rows];
    return this;
  }
}