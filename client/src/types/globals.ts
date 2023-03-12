export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      GENERATE_SOURCEMAP: string;
      PORT: string;
      REACT_APP_PROFILE_SERVICE_URL: string;
      REACT_APP_AUTH_SERVICE_URL: string;
      REACT_APP_CONTENT_SERVICE_URL: string;
      REACT_APP_CLOUDFLARE_SERVICE_URL: string;
    };
  }
}
