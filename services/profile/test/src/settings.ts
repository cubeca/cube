import * as dotenv from 'dotenv';

dotenv.config();

export const PROFILE_MICROSERVICE: string = process.env.PROFILE_MICROSERVICE || 'localhost';
export const IDENTITY_MICROSERVICE: string = process.env.IDENTITY_MICROSERVICE || 'localhost';
export const PROFILE_PORT: number = parseInt((process.env.PROFILE_PORT as string) || '8083', 10);
export const IDENTITY_PORT: number = parseInt((process.env.IDENTITY_PORT as string) || '8082', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';
