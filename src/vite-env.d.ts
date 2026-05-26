/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_CP_TRAVEL_API_URL?: string;
  readonly VITE_CP_API_KEY?: string;
  readonly VITE_CP_CONNECT_ID?: string;
  readonly VITE_CP_CONNECT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
