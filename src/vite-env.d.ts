/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CASHFREE_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@cashfreepayments/cashfree-js' {
  export function load(options: { mode: 'sandbox' | 'production' }): Promise<any>;
}
