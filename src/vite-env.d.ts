/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_POSTHOG_TOKEN?: string;
  readonly VITE_POSTHOG_HOST?: string;
  /** @deprecated Use VITE_POSTHOG_TOKEN */
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  /** @deprecated Use VITE_POSTHOG_HOST */
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_BUILD_NUMBER?: string;
  readonly VITE_CP_TRAVEL_API_URL?: string;
  readonly VITE_CP_API_KEY?: string;
  readonly VITE_CP_CONNECT_ID?: string;
  readonly VITE_CP_CONNECT_SECRET?: string;
  /** RevenueCat Web Billing public SDK key (`rcb_…`, `rcb_sb_…`, or `test_…` for local dev). */
  readonly VITE_REVENUECAT_WEB_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
