import { Pool } from 'pg';
import * as settings from '../settings';

const createPool = (database: string) =>
  new Pool({
    host: settings.PGHOST,
    port: settings.PGPORT,
    user: settings.PGUSER,
    password: settings.PGPASSWORD,
    database,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });

const pool = createPool(settings.PGDATABASE);
const poolIdentity = createPool(settings.PGUSERDATABASE);

export const query = async (pool: Pool, sql: string, params: any[]) => {
  const res = await pool.query(sql, ...params);
  return res;
};

export const querySingle = async (pool: Pool, sql: string, params: any[]) => {
  const dbResult = await query(pool, sql, params);
  return dbResult.rows.length === 0 ? null : dbResult.rows[0];
};

export const queryDefault = (sql: string, ...params: any[]) => query(pool, sql, params);
export const queryIdentity = (sql: string, ...params: any[]) => query(poolIdentity, sql, params);
export const querySingleDefault = (sql: string, ...params: any[]) => querySingle(pool, sql, params);
