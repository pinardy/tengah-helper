/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute base URL of the bus-arrival API; empty = same origin. */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
