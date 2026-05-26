import type { PostHog } from "posthog-js";

/** Stable anonymous distinct ID (survives reloads; used until real login). */
export const ANONYMOUS_ID_STORAGE_KEY = "pn_posthog_anonymous_id";

export type AuthenticatedUserTraits = {
  email?: string;
  name?: string;
  [key: string]: unknown;
};

function createAnonymousId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Persistent ID for this browser profile. Same key is used for PostHog `identify`
 * so events attach to one person profile before login.
 */
export function getOrCreateAnonymousId(): string {
  if (typeof localStorage === "undefined") {
    return createAnonymousId();
  }

  try {
    const existing = localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;

    const id = createAnonymousId();
    localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return createAnonymousId();
  }
}

/**
 * Create a PostHog person profile for this visitor (`person_profiles: identified_only`).
 * @see https://posthog.com/docs/data/persons#capturing-person-profiles
 */
export function identifyAnonymousUser(client: PostHog): string {
  const anonymousId = getOrCreateAnonymousId();

  client.identify(anonymousId, {
    is_anonymous: true,
  });

  client.register({
    is_anonymous: true,
  });

  return anonymousId;
}

/**
 * Call after login/sign-up so future events use the real user id.
 * Links the prior anonymous profile via `alias`, then identifies the authenticated user.
 */
export function identifyAuthenticatedUser(
  client: PostHog,
  userId: string,
  traits: AuthenticatedUserTraits = {},
): void {
  const anonymousId = getOrCreateAnonymousId();

  if (anonymousId !== userId) {
    client.alias(userId, anonymousId);
  }

  client.identify(userId, {
    ...traits,
    is_anonymous: false,
  });

  client.register({
    is_anonymous: false,
  });
}
