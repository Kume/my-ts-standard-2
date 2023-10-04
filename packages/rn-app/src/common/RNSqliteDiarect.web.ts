import {
  CompiledQuery,
  DatabaseConnection,
  QueryResult,
  DatabaseIntrospector,
  Dialect,
  DialectAdapter,
  Driver,
  Kysely,
  QueryCompiler,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from 'kysely';
import {SqliteClient} from './SQLiteClient';

export class RNSqliteDialect implements Dialect {
  createDriver(): Driver {
    return new RNSqliteDriver();
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createAdapter(): DialectAdapter {
    return new SqliteAdapter();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new SqliteIntrospector(db);
  }
}

export class RNSqliteDriver implements Driver {
  private client: SqliteClient | undefined;
  readonly connectionMutex = new ConnectionMutex();

  private connection?: DatabaseConnection;

  async init(): Promise<void> {
    this.client = new SqliteClient('main.sqlite3', '/src/common/sqlite-worker.js?type=module&worker_file');
    await this.client.init();
    this.connection = new RNSqliteConnection(this.client);
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    await this.connectionMutex.lock();
    return this.connection!;
  }

  async beginTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('begin'));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('commit'));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('rollback'));
  }

  async releaseConnection(): Promise<void> {
    this.connectionMutex.unlock();
  }

  async destroy(): Promise<void> {
    this.client = undefined;
  }
}

class RNSqliteConnection implements DatabaseConnection {
  readonly client: SqliteClient;

  constructor(client: SqliteClient) {
    this.client = client;
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const {query, sql, parameters} = compiledQuery;
    console.debug('executeQuery', sql, parameters);

    switch (query.kind) {
      case 'SelectQueryNode':
      case 'RawNode': {
        const result = await this.client.executeSql(sql, parameters);
        return {rows: result as O[]};
      }
      default: {
        return this.client.executeSqlWithChanges(sql, parameters) as Promise<QueryResult<O>>;
      }
    }
  }

  // eslint-disable-next-line require-yield -- 意図的に未実装である例外を投げているので、yieldの記載は不要
  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("Sqlite driver doesn't support streaming");
  }
}

class ConnectionMutex {
  promise?: Promise<void>;
  resolve?: () => void;

  async lock(): Promise<void> {
    while (this.promise) {
      await this.promise;
    }

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  unlock(): void {
    const resolve = this.resolve;

    this.promise = undefined;
    this.resolve = undefined;

    resolve?.();
  }
}
