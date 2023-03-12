export const PROFILE_SERVICE_URL: string =
  window.__RUNTIME_CONFIG__.REACT_APP_PROFILE_SERVICE_URL ||
  process.env.REACT_APP_PROFILE_SERVICE_URL ||
  '';
export const AUTH_SERVICE_URL: string =
  window.__RUNTIME_CONFIG__.REACT_APP_AUTH_SERVICE_URL ||
  process.env.REACT_APP_AUTH_SERVICE_URL ||
  '';

export const CONTENT_SERVICE_URL: string =
  window.__RUNTIME_CONFIG__.REACT_APP_CONTENT_SERVICE_URL ||
  process.env.REACT_APP_CONTENT_SERVICE_URL ||
  '';

export const CLOUDFLARE_SERVICE_URL: string =
  window.__RUNTIME_CONFIG__.REACT_APP_CLOUDFLARE_SERVICE_URL ||
  process.env.REACT_APP_CLOUDFLARE_SERVICE_URL ||
  '';

export const DEFAULT_API_VERSION = 'v1';
// export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;
export const API_BASE_PATH = '';

export const PROFILE_API_PATH = `${PROFILE_SERVICE_URL}${API_BASE_PATH}/profiles`;
export const CONTENT_API_PATH = `${CONTENT_SERVICE_URL}${API_BASE_PATH}/content`;
export const COLLABORATORS_API_PATH = `${CONTENT_SERVICE_URL}${API_BASE_PATH}/collaborators`;
export const UPLOADS_API_PATH = `${CLOUDFLARE_SERVICE_URL}${API_BASE_PATH}/uploads`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
