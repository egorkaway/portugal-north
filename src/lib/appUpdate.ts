import { fetchBuildInfo } from "@/lib/buildInfo";

/** Build baked into this JS bundle at compile time. */
export const APP_BUILD_NUMBER = import.meta.env.VITE_BUILD_NUMBER ?? "0";

/** Minimum gap between service worker update checks (Safari throttles less when spaced). */
export const APP_UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

const LAST_SW_CHECK_KEY = "pn_last_sw_update_check";
const RELOAD_GUARD_KEY = "pn_reloaded_for_build";

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

  let remoteBuildNumber: string;
  try {
    const remote = await fetchBuildInfo();
    remoteBuildNumber = remote.buildNumber;
  } catch {
    return false;
  }

  if (remoteBuildNumber === APP_BUILD_NUMBER) {
    sessionStorage.removeItem(RELOAD_GUARD_KEY);
    return false;
  }

  const alreadyReloaded = sessionStorage.getItem(RELOAD_GUARD_KEY) === remoteBuildNumber;

  await checkForServiceWorkerUpdate();

  if (alreadyReloaded) {
    await clearServiceWorkerCaches();
  } else {
    sessionStorage.setItem(RELOAD_GUARD_KEY, remoteBuildNumber);
  }

  window.location.reload();
  return true;
}
