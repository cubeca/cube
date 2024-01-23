import * as dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || 'http://localhost';
export const PORT = parseInt(process.env.PORT || '8080', 10);

export const COCKROACH_DB_CONNECTION_STRING = process.env.COCKROACH_DB_CONNECTION_STRING || 'postgresql://root@localhost:26257/defaultdb?sslmode=disable';

export const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET || 'encrypt_secret';
export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || 'secret';
export const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
export const CONTACT_US_EMAIL = process.env.CONTACT_US_EMAIL || '';
