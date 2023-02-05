export const API_URL: string = process.env.REACT_APP_API_URL || '';
export const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE_URL;

export const DEFAULT_API_VERSION = 'v1';
// export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;
export const API_BASE_PATH = '';

export const PROFILE_API_PATH = `${API_URL}${API_BASE_PATH}/profiles`;
export const CONTENT_API_PATH = `${API_URL}${API_BASE_PATH}/content`;
export const COLLABORATORS_API_PATH = `${API_URL}${API_BASE_PATH}/collaborators`;
export const UPLOADS_API_PATH = `${API_URL}${API_BASE_PATH}/uploads`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
