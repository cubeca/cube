import * as dotenv from 'dotenv';

dotenv.config();

export const MICROSERVICE: string = process.env.MICROSERVICE || 'cube_profile_microservice';
export const PORT: number = parseInt((process.env.PORT as string) || '8080', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';
