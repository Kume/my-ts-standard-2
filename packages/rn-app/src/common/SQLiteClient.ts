import * as Comlink from 'comlink';

interface SQLiteWorker {
  init(dbFile: string, rowMode?: 'object' | 'array'): Promise<void>;
  executeSql(
    sqlStatement: string,
    bindParameters: readonly unknown[],
    callback: (rows: unknown[]) => void,
  ): Promise<void>;
  executeSqlWithChanges(
    sqlStatement: string,
    bindParameters: readonly unknown[],
    callback: (rows: {rows: unknown[]; numAffectedRows: number}) => void,
  ): Promise<void>;
}

export class SqliteClient {
  private sqliteWorker?: SQLiteWorker;

  private dbFile: string;
  private sqliteWorkerPath: string;
  private rowMode: 'object' | 'array';

  constructor(dbFile: string, sqliteWorkerPath: string, rowMode: 'object' | 'array' = 'object') {
    if (typeof dbFile !== 'string') {
      throw new Error(
        `The 'dbFile' parameter passed to the 'SqliteClient' constructor must be of type 'string'. Instead, you passed: '${typeof dbFile}'.`,
      );
    }

    if (typeof sqliteWorkerPath !== 'string') {
      throw new Error(
        `The 'sqliteWorkerPath' parameter passed to the 'SqliteClient' constructor must be of type 'string'. Instead, you passed: '${typeof sqliteWorkerPath}'.`,
      );
    }

    this.dbFile = dbFile;
    this.sqliteWorkerPath = sqliteWorkerPath;
    if (rowMode && rowMode !== 'array' && rowMode !== 'object') {
      throw new Error('Invalid rowMode');
    }
    this.rowMode = rowMode;
  }

  async init(): Promise<void> {
    const SqliteWorker = Comlink.wrap(
      // @ts-expect-error Workerはweb版でしか使わないので型定義がない
      new Worker(this.sqliteWorkerPath, {
        type: 'module',
      }),
    );

    // @ts-expect-error 型定義上はSqliteWorkerにコンストラクタがあると認識されない
    this.sqliteWorker = await new SqliteWorker();

    await this.sqliteWorker?.init(this.dbFile, this.rowMode);
  }

  async executeSql(sqlStatement: string, bindParameters: readonly unknown[] = []): Promise<unknown[]> {
    if (typeof sqlStatement !== 'string') {
      throw new Error(
        `The 'sqlStatement' parameter passed to the 'executeSql' method of the 'SqliteClient' must be of type 'string'. Instead, you passed: '${typeof sqlStatement}'.`,
      );
    }

    if (!Array.isArray(bindParameters)) {
      throw new Error(
        `The 'bindParameters' parameter passed to the 'executeSql' method of the 'SqliteClient' must be of type 'array'. Instead, you passed: '${typeof bindParameters}'.`,
      );
    }

    return new Promise(async (resolve) => {
      await this.sqliteWorker?.executeSql(
        sqlStatement,
        bindParameters,
        Comlink.proxy((rows) => {
          return resolve(rows);
        }),
      );
    });
  }

  async executeSqlWithChanges(
    sqlStatement: string,
    bindParameters: readonly unknown[] = [],
  ): Promise<{rows: unknown[]; numAffectedRows: BigInt}> {
    if (typeof sqlStatement !== 'string') {
      throw new Error(
        `The 'sqlStatement' parameter passed to the 'executeSql' method of the 'SqliteClient' must be of type 'string'. Instead, you passed: '${typeof sqlStatement}'.`,
      );
    }

    if (!Array.isArray(bindParameters)) {
      throw new Error(
        `The 'bindParameters' parameter passed to the 'executeSql' method of the 'SqliteClient' must be of type 'array'. Instead, you passed: '${typeof bindParameters}'.`,
      );
    }

    return new Promise(async (resolve) => {
      await this.sqliteWorker?.executeSqlWithChanges(
        sqlStatement,
        bindParameters,
        Comlink.proxy(({rows, numAffectedRows}: {rows: unknown[]; numAffectedRows: number}) => {
          return resolve({rows: rows as unknown[], numAffectedRows: BigInt(numAffectedRows)});
        }),
      );
    });
  }
}
