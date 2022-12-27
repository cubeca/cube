export const APP_URL: string = process.env.REACT_APP_ORIGIN || '';
export const API_URL: string = process.env.REACT_APP_API_URL || '';

export const DEFAULT_API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;

export const CONTENT_API_PATH = `${API_URL}${API_BASE_PATH}/content`;
export const PROFILE_API_PATH = `${API_URL}${API_BASE_PATH}/profiles`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
