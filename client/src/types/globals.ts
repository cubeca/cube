export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      GENERATE_SOURCEMAP: string;
      PORT: string;
    };
  }
}
