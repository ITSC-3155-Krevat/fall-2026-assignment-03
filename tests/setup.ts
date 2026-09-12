import { beforeAll, beforeEach, afterAll } from 'vitest';
import { sql } from 'kysely';
import { db } from '../src/db/database.js';
import { migrateToLatest } from '../src/db/migrator.js';

beforeAll(async () => {
  try {
    await migrateToLatest(db);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'ECONNREFUSED'
    ) {
      console.error(
        '\n❌ Could not connect to PostgreSQL database on port 5432.\n   Please start the database before running tests: docker compose up -d\n',
      );
    }
    throw err;
  }
});

beforeEach(async () => {
  try {
    await sql`TRUNCATE TABLE users, tickets RESTART IDENTITY CASCADE`.execute(
      db,
    );
  } catch {
    // Ignore if tables are not yet created
  }
});

afterAll(async () => {
  await db.destroy();
});
