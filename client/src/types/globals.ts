export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      GENERATE_SOURCEMAP: string;
      PORT: string;
      REACT_APP_CLOUDFLARE_SERVICE_URL: string;
      REACT_APP_BFF_URL: string;
    };
  }
}
