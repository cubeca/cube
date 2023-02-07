import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as settings from '../settings';

dotenv.config();

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
  const start = Date.now();
  const res = await pool.query(text, params || []);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};
