import * as dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt((process.env.PORT as string) || '8080', 10);
export const JWT_TOKEN_SECRET: string = process.env.JWT_TOKEN_SECRET || 'secret';

export const CLOUDFLARE_SERVICE_URL: string = process.env.CLOUDFLARE_SERVICE_URL || 'https://cloudflare-tjjg4pjowa-pd.a.run.app';
export const CONTENT_SERVICE_URL: string = process.env.CONTENT_SERVICE_URL || 'https://content-tjjg4pjowa-pd.a.run.app';
export const IDENTITY_SERVICE_URL: string = process.env.IDENTITY_SERVICE_URL || 'https://identity-tjjg4pjowa-pd.a.run.app';
export const PROFILE_SERVICE_URL: string = process.env.PROFILE_SERVICE_URL || 'https://profile-tjjg4pjowa-pd.a.run.app';
