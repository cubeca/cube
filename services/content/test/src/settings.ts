import * as dotenv from 'dotenv';
dotenv.config();

export const CONTENT_MICROSERVICE: string = process.env.CONTENT_MICROSERVICE || 'localhost'
export const IDENTITY_MICROSERVICE: string = process.env.IDENTITY_MICROSERVICE || 'localhost'
export const CONTENT_PORT: number = parseInt((process.env.CONTENT_PORT as string) || '8081', 10);
export const IDENTITY_PORT: number = parseInt((process.env.IDENTITY_PORT as string) || '8082', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';

export const PGHOST: string = process.env.PGHOST || 'localhost';
export const PGPORT: number = parseInt((process.env.PGPORT as string) || '5432', 10);
export const PGUSER: string = process.env.PGUSER || 'postgres';
export const PGPASSWORD: string = process.env.PGPASSWORD || 'admin';
export const PGDATABASE: string = process.env.PGDATABASE || 'cube_content';
export const PGUSERDATABASE: string = process.env.PGDATABASE || 'cube_identity';
