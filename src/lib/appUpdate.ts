import { fetchBuildInfo } from "@/lib/buildInfo";

/** Build baked into this JS bundle at compile time. */
export const APP_BUILD_NUMBER = import.meta.env.VITE_BUILD_NUMBER ?? "0";

/** Minimum gap between service worker update checks (Safari throttles less when spaced). */
export const APP_UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

const LAST_SW_CHECK_KEY = "pn_last_sw_update_check";
export const RELOAD_GUARD_KEY = "pn_reloaded_for_build";
export const CACHE_CLEARED_GUARD_KEY = "pn_cache_cleared_for_build";

export type BuildReloadPlan =
  | { action: "render" }
  | { action: "reload"; markReloadGuard: string; clearReloadGuard?: never }
  | { action: "reload"; markCacheClearedGuard: string; clearReloadGuard?: never };

type SessionStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function planBuildReload(
  remoteBuildNumber: string,
  appBuildNumber: string,
  session: SessionStore,
): BuildReloadPlan {
  if (remoteBuildNumber === appBuildNumber) {
    session.removeItem(RELOAD_GUARD_KEY);
    session.removeItem(CACHE_CLEARED_GUARD_KEY);
    return { action: "render" };
  }

  const alreadyReloaded = session.getItem(RELOAD_GUARD_KEY) === remoteBuildNumber;
  const cacheAlreadyCleared =
    session.getItem(CACHE_CLEARED_GUARD_KEY) === remoteBuildNumber;

  if (alreadyReloaded && cacheAlreadyCleared) {
    return { action: "render" };
  }

  if (alreadyReloaded) {
    return { action: "reload", markCacheClearedGuard: remoteBuildNumber };
  }

  return { action: "reload", markReloadGuard: remoteBuildNumber };
}

async function clearServiceWorkerCaches(): Promise<void> {
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
    }
  }
}

export function getLastServiceWorkerCheckAt(): number {
  if (typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(LAST_SW_CHECK_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function markServiceWorkerChecked(now = Date.now()): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LAST_SW_CHECK_KEY, String(now));
}

export function shouldCheckForServiceWorkerUpdate(now = Date.now()): boolean {
  return now - getLastServiceWorkerCheckAt() >= APP_UPDATE_CHECK_INTERVAL_MS;
}

/** Triggers a service worker update check (Safari may otherwise skip it for days). */
export async function checkForServiceWorkerUpdate(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  try {
    await registration.update();
  } catch {
    // Offline or transient — try again next visit.
  } finally {
    markServiceWorkerChecked();
  }
}

/**
 * If the running bundle is older than /version.json, reload once so Safari/PWA users
 * pick up new routes (e.g. /all) without clearing site data manually.
 */
export async function ensureLatestBuild(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  // Dev server keeps an embedded build from startup; production builds bump version.json.
  if (import.meta.env.DEV) return false;

  let remoteBuildNumber: string;
  try {
    const remote = await fetchBuildInfo();
    remoteBuildNumber = remote.buildNumber;
  } catch {
    return false;
  }

  const plan = planBuildReload(remoteBuildNumber, APP_BUILD_NUMBER, sessionStorage);
  if (plan.action === "render") {
    return false;
  }

  await checkForServiceWorkerUpdate();

  if ("markCacheClearedGuard" in plan && plan.markCacheClearedGuard) {
    await clearServiceWorkerCaches();
    sessionStorage.setItem(CACHE_CLEARED_GUARD_KEY, plan.markCacheClearedGuard);
  } else if ("markReloadGuard" in plan && plan.markReloadGuard) {
    sessionStorage.setItem(RELOAD_GUARD_KEY, plan.markReloadGuard);
  }

  window.location.reload();
  return true;
}
