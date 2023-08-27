export const CLOUDFLARE_SERVICE_URL: string =
  window.__RUNTIME_CONFIG__.REACT_APP_CLOUDFLARE_SERVICE_URL ||
  process.env.REACT_APP_CLOUDFLARE_SERVICE_URL ||
  '';

export const BFF_URL: string =
  window.__RUNTIME_CONFIG__.REACT_APP_BFF_URL ||
  process.env.REACT_APP_BFF_URL ||
  '';

export const DEFAULT_API_VERSION = 'v1';
// export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;
export const API_BASE_PATH = '';

export const UPLOADS_API_PATH = `${CLOUDFLARE_SERVICE_URL}${API_BASE_PATH}/uploads`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
