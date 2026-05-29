/** How often to ask the browser to check for a new app shell (stations, hotels, images in JS). */
export const APP_UPDATE_CHECK_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

const LAST_SW_CHECK_KEY = "pn_last_sw_update_check";

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
