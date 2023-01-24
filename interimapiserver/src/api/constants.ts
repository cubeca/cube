export const APP_URL: string = process.env.REACT_APP_ORIGIN || '';
export const API_URL: string = process.env.REACT_APP_API_URL || '';

export const DEFAULT_API_VERSION = 'v1';
export const API_BASE_PATH = ''; //`/api/${DEFAULT_API_VERSION}`;

export const CONTENT_API_PATH = `${API_URL}${API_BASE_PATH}/content`;
export const PROFILE_API_PATH = `${API_URL}${API_BASE_PATH}/profiles`;

export const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } = process.env;
export const CLOUDFLARE_API_STREAM = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
