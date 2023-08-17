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

export const query = async (text: string, params?: string[]) => {
  const res = await pool.query(text, params || []);
  return res;
};
