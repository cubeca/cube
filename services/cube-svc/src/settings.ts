import * as dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || 'http://localhost';
export const PORT = parseInt(process.env.PORT || '8080', 10);

export const COCKROACH_DB_CONNECTION_STRING = process.env.COCKROACH_DB_CONNECTION_STRING || 'postgresql://root@localhost:26257/defaultdb?sslmode=disable';
export const CUBE_SVC_HOST = process.env.CUBE_SVC_HOST || 'http://localhost';

export const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET || 'encrypt_secret';
export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || 'secret';
export const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
export const CONTACT_US_EMAIL = process.env.CONTACT_US_EMAIL || '';
export const REPORT_ABUSE_EMAIL = process.env.REPORT_ABUSE_EMAIL || '';

export const CLOUDFLARE_ACCOUNT_ID: string = process.env.CLOUDFLARE_ACCOUNT_ID || '__UNSET__';
export const CLOUDFLARE_API_TOKEN: string = process.env.CLOUDFLARE_API_TOKEN || '__UNSET__';
export const CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN: string = process.env.CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN || '__UNSET__';
export const CLOUDFLARE_R2_ACCESS_KEY_ID: string = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '__UNSET__';
export const CLOUDFLARE_R2_SECRET_ACCESS_KEY: string = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '__UNSET__';
export const CLOUDFLARE_R2_BUCKET_NAME: string = process.env.CLOUDFLARE_R2_BUCKET_NAME || '__UNSET__';
export const CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL: string = process.env.CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL || '__UNSET__';
