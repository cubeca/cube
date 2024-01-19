import * as dotenv from 'dotenv';
dotenv.config();

export const COCKROACH_DB_CONNECTION_STRING =
  process.env.COCKROACH_DB_CONNECTION_STRING || 'postgresql://root@localhost:26257/defaultdb?sslmode=disable';

export const PORT: number = parseInt((process.env.PORT as string) || '8080', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';

export const PGHOST: string = process.env.PGHOST || 'localhost';
export const PGPORT: number = parseInt((process.env.PGPORT as string) || '5432', 10);
export const PGUSER: string = process.env.PGUSER || 'postgres';
export const PGPASSWORD: string = process.env.PGPASSWORD || 'admin';
export const PGDATABASE: string = process.env.PGDATABASE || 'cube_identity';
export const PGUSERDATABASE: string = process.env.PGUSERDATABASE || 'cube_identity';
