/**
 * One-shot database bootstrap / seed runner.
 *
 * Run it from inside the deployed backend container (see DEPLOYMENT.md):
 *
 *   node dist/scripts/migrate.js --schema --i-know-this-drops-tables
 *   node dist/scripts/migrate.js --seed
 *
 * schema.sql begins with DROP TABLE ... CASCADE, so it DESTROYS all existing
 * data. That is why it is never run automatically on deploy and why it needs
 * the explicit --i-know-this-drops-tables acknowledgement.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pool } from '../config/db.js';

const args = process.argv.slice(2);
const wantSchema = args.includes('--schema');
const wantSeed = args.includes('--seed');
const acknowledged = args.includes('--i-know-this-drops-tables');

function fail(message: string): never {
  console.error(`✖ ${message}`);
  process.exit(1);
}

async function runSqlFile(label: string, file: string): Promise<void> {
  const full = path.resolve(process.cwd(), 'src', 'database', file);
  let sql: string;
  try {
    sql = readFileSync(full, 'utf8');
  } catch {
    fail(`Could not read ${full}`);
  }

  console.log(`→ Applying ${label} (${file}) ...`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(`✔ ${label} applied`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  if (!wantSchema && !wantSeed) {
    fail('Nothing to do. Pass --schema and/or --seed.');
  }
  if (wantSchema && !acknowledged) {
    fail(
      'Refusing to run schema.sql: it drops every table first.\n' +
        '  Re-run with --i-know-this-drops-tables if that is really what you want.'
    );
  }

  if (wantSchema) await runSqlFile('schema', 'schema.sql');
  if (wantSeed) await runSqlFile('seed', 'seed.sql');

  await pool.end();
  console.log('✔ Done');
}

main().catch(async (error: unknown) => {
  console.error('✖ Migration failed:', error instanceof Error ? error.message : error);
  await pool.end().catch(() => {});
  process.exit(1);
});
