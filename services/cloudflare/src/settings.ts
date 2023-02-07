import * as dotenv from "dotenv"

dotenv.config()

export const PORT: number = parseInt((process.env.PORT as string) || '8080', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';

export const PGHOST: string = process.env.PGHOST || 'localhost';
export const PGPORT: number = parseInt((process.env.PGPORT as string) || '5432', 10);
export const PGUSER: string = process.env.PGUSER || 'postgres';
export const PGPASSWORD: string = process.env.PGPASSWORD || 'admin';
export const PGDATABASE: string = process.env.PGDATABASE || 'cube_identity';

export const CLOUDFLARE_ACCOUNT_ID: string = process.env.CLOUDFLARE_ACCOUNT_ID || '__INVALID__';
export const CLOUDFLARE_API_TOKEN: string = process.env.CLOUDFLARE_API_TOKEN || '__INVALID__';
