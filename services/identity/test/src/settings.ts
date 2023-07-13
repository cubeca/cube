import * as dotenv from 'dotenv';

dotenv.config();

export const MICROSERVICE: string = process.env.MICROSERVICE || 'localhost';
export const PORT: number = parseInt((process.env.PORT as string) || '8082', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';
