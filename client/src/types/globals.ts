export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      GENERATE_SOURCEMAP: string;
      PORT: string;
      REACT_APP_API_URL: string;
      REACT_APP_AUTH_SERVICE_URL: string;
    };
  }
}
