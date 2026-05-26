import posthog from "posthog-js";
import { identifyAnonymousUser } from "@/lib/posthogIdentity";

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
    // We call identify() with a stable anonymous id on load (see posthogIdentity.ts).
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (client) => {
      identifyAnonymousUser(client);
    },
    ...(import.meta.env.DEV
      ? {
          debug: true,
          // Allow local / Playwright testing (PostHog otherwise treats headless as a bot).
          opt_out_useragent_filter: true,
        }
      : {}),
  });
}

export { identifyAuthenticatedUser, getOrCreateAnonymousId } from "@/lib/posthogIdentity";

/** Queue-safe capture — waits for PostHog to finish loading. */
export function capturePostHog(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!isPostHogEnabled) return;

  const send = () => posthog.capture(event, properties);

  if (posthog.__loaded) {
    send();
    return;
  }

  posthog.on("loaded", send);
}

export { posthog };
