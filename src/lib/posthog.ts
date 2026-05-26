import posthog from "posthog-js";

const key =
  import.meta.env.VITE_POSTHOG_TOKEN ?? import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const host =
  import.meta.env.VITE_POSTHOG_HOST ??
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST ??
  "https://us.i.posthog.com";

export const isPostHogEnabled = Boolean(key);

export function initPostHog(): void {
  if (!key || typeof window === "undefined") return;

  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export { posthog };
