import { Pool } from 'pg';
import * as settings from '../settings';

const pool = new Pool({
  host: settings.PGHOST,
  port: settings.PGPORT,
  user: settings.PGUSER,
  password: settings.PGPASSWORD,
  database: settings.PGDATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

export const query = async (sql: string, ...params: any[]) => {
  const start = Date.now();
  const res = await pool.query(sql, params);
  const durationMs = Date.now() - start;
  console.log('executed query', { sql, params, durationMs, rows: { processed: res.rowCount, returned: res.rows.length } });
  return res;
};

export const querySingle = async (sql: string, ...params: any[]) => {
  const dbResult = await query(sql, ...params);
  return (dbResult.rows.length === 0) ? null : dbResult.rows[0];
};
