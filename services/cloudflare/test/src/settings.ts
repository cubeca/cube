import * as dotenv from 'dotenv';

dotenv.config();

export const MICROSERVICE: string = process.env.MICROSERVICE || 'localhost';
export const PORT: number = parseInt((process.env.PORT as string) || '8080', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';

export const CLOUDFLARE_ACCOUNT_ID: string = process.env.CLOUDFLARE_ACCOUNT_ID || '__INVALID__';
export const CLOUDFLARE_API_TOKEN: string = process.env.CLOUDFLARE_API_TOKEN || '__INVALID__';
export const CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN: string =
  process.env.CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN || '__INVALID__';
