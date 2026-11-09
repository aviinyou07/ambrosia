import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

/**
 * TLS is opt-in via DB_SSL.
 *
 *   DB_SSL unset / "false" / "disable"  -> no explicit ssl option. For a
 *     DATABASE_URL, `pg` then honours any `sslmode=` in the URL itself.
 *     This is the right default for a Coolify-managed Postgres, which is
 *     reached over the private Docker network and serves no TLS.
 *   DB_SSL "true" / "require"           -> TLS without CA verification,
 *     which is what hosted providers (Neon, Supabase, RDS) expect.
 *   DB_SSL "verify"                     -> TLS with full CA verification.
 */
const sslSetting = (process.env.DB_SSL || '').trim().toLowerCase();

const sslOption: pg.PoolConfig['ssl'] =
  sslSetting === 'verify'
    ? { rejectUnauthorized: true }
    : sslSetting === 'true' || sslSetting === 'require'
      ? { rejectUnauthorized: false }
      : undefined;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ...(sslOption ? { ssl: sslOption } : {}),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'ambrosia_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || undefined,
        ...(sslOption ? { ssl: sslOption } : {}),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (!isProduction) {
    console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
  }
  return res;
};
