import * as dotenv from 'dotenv';
dotenv.config();

export const COCKROACH_DB_CONNECTION_STRING =
  process.env.COCKROACH_DB_CONNECTION_STRING || 'postgresql://root@localhost:26257/defaultdb?sslmode=disable';

export const HOST = process.env.HOST || 'http://localhost';
export const PORT = parseInt(process.env.PORT || '8080', 10);

export const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET || 'encrypt_secret';
export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || 'secret';
export const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
export const CONTACT_US_EMAIL = process.env.CONTACT_US_EMAIL || '';

export const PGHOST = process.env.PGHOST || 'localhost';
export const PGPORT = parseInt(process.env.PGPORT || '5432', 10);
export const PGUSER = process.env.PGUSER || 'postgres';
export const PGPASSWORD = process.env.PGPASSWORD || 'admin';
export const PGDATABASE = process.env.PGDATABASE || 'cube_identity';

export const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:8083';
