import * as dotenv from 'dotenv';
dotenv.config();

export const PROFILE_MICROSERVICE: string = process.env.PROFILE_MICROSERVICE || 'localhost';
export const CONTENT_MICROSERVICE: string = process.env.CONTENT_MICROSERVICE || 'localhost';
export const CLOUDFLARE_MICROSERVICE: string = process.env.CLOUDFLARE_MICROSERVICE || 'localhost';
export const IDENTITY_MICROSERVICE: string = process.env.IDENTITY_MICROSERVICE || 'localhost';
export const BFF_MICROSERVICE: string = process.env.BFF_MICROSERVICE || 'localhost';
export const PROFILE_PORT: number = parseInt((process.env.PROFILE_PORT as string) || '8083', 10);
export const CONTENT_PORT: number = parseInt((process.env.CONTENT_PORT as string) || '8081', 10);
export const CLOUDFLARE_PORT: number = parseInt((process.env.CLOUDFLARE_PORT as string) || '8080', 10);
export const IDENTITY_PORT: number = parseInt((process.env.IDENTITY_PORT as string) || '8082', 10);
export const BFF_PORT: number = parseInt((process.env.BFF_PORT as string) || '8084', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';
