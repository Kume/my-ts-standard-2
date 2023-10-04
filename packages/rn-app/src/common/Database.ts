import {Generated, Kysely, Migration, MigrationProvider, Migrator} from 'kysely';
import {RNSqliteDialect} from './RNSqliteDiarect.web';
import * as migrations from './migrations';

interface Database {
  test: {
    id: Generated<number>;
    name: string;
  };
}

export const db = new Kysely<Database>({dialect: new RNSqliteDialect()});

export class ObjectMigrationProvider implements MigrationProvider {
  public constructor(private readonly migrations: Readonly<Record<string, Migration>>) {}

  getMigrations(): Promise<Record<string, Migration>> {
    return Promise.resolve(this.migrations);
  }
}

export const migrator = new Migrator({
  db,
  provider: new ObjectMigrationProvider(migrations),
});
