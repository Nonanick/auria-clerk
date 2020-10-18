import { Database } from 'sqlite3';
import { AppException } from '../../../error/AppException';
import { MaybePromise } from '../../../error/Maybe';
import { ComparableValues } from '../../../query/filter/FilterComparisson';
import { SQLiteArchive } from '../SQLiteArchive';

export class SQLiteArchiveTransaction {

  protected _trxConn?: Database;
  protected _ended: boolean = false;

  constructor(protected _conn: SQLiteArchive) {
  }

  protected async getConnection() {

    if (this._ended) {
      throw new AppException('SQLite Transaction already finished!');
    }

    if (this._trxConn == null) {
      this._trxConn = await this._conn.connection();
      await this._trxConn?.exec('START TRANSACTION');
    }

    return this._trxConn;
  }


  async execute(
    query: string,
    params: ComparableValues[] = []
  ) {
    if (this._ended) {
      throw new AppException('Mysql Transaction already finished!');
    }

    let poolConn = await this.getConnection();

    try {
      let stmt = await poolConn.prepare(query, params);
      let ret = stmt.run();
      return ret;
    } catch (err) {
      await this.rollback();
      throw err;
    }
  }

  async lastInsertedId(): MaybePromise<any> {
    return await this.execute('SELECT last_inserted_id();');
  }

  async commit() {
    if (this._ended) {
      throw new AppException('Mysql Transaction already finished!');
    }
    this._ended = true;
    try {
      this._trxConn!.exec('COMMIT');
    } catch (err) {
      this._trxConn!.exec('ROLLBACK');
      throw err;
    } finally {
      delete this._trxConn;
    }
  }

  async rollback() {
    if (this._ended) {
      throw new AppException('Mysql Transaction already finished!');
    }
    this._ended = true;

    try {
      this._trxConn!.exec('ROLLBACK');
    } catch (err) {
      console.error('Failed to rollback mysql transaction! ', err);
    } finally {
      delete this._trxConn;
    }
  }

}