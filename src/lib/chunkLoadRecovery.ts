import { clearClientCaches } from "@/lib/appUpdate";

export const CHUNK_RELOAD_GUARD_KEY = "pn_reloaded_for_chunk";
export const CHUNK_CACHE_CLEARED_GUARD_KEY = "pn_chunk_cache_cleared";

export type ChunkLoadReloadPlan =
  | { action: "show" }
  | { action: "reload"; clearCaches: boolean };

type SessionStore = Pick<Storage, "getItem" | "setItem">;

const CHUNK_LOAD_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Failed to load module script|Expected a JavaScript|Loading chunk [\w-]+ failed|Unable to preload CSS/i;

export function isChunkLoadError(error: unknown): boolean {
  if (error == null) return false;
  if (typeof error === "object" && "name" in error && error.name === "ChunkLoadError") {
    return true;
  }
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === "string"
        ? error
        : String(error);
  return CHUNK_LOAD_ERROR_PATTERN.test(message);
}

export function planChunkLoadReload(session: SessionStore): ChunkLoadReloadPlan {
  const alreadyReloaded = session.getItem(CHUNK_RELOAD_GUARD_KEY) === "1";
  const cacheAlreadyCleared = session.getItem(CHUNK_CACHE_CLEARED_GUARD_KEY) === "1";

  if (alreadyReloaded && cacheAlreadyCleared) {
    return { action: "show" };
  }

  return { action: "reload", clearCaches: alreadyReloaded };
}

/**
 * Reload once for a stale hashed chunk, then clear SW caches and reload again.
 * Returns whether a reload was started (callers should not keep rendering).
 */
export function recoverFromChunkLoadError(error: unknown): boolean {
  if (typeof window === "undefined" || !isChunkLoadError(error)) return false;

  const plan = planChunkLoadReload(sessionStorage);
  if (plan.action === "show") return false;

  void (async () => {
    if (plan.clearCaches) {
      await clearClientCaches();
      sessionStorage.setItem(CHUNK_CACHE_CLEARED_GUARD_KEY, "1");
    } else {
      sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, "1");
    }
    window.location.reload();
  })();

  return true;
}

type VitePreloadErrorEvent = Event & { payload?: unknown };

let installed = false;

/** Vite fires this when a modulepreload / dynamic import cannot be parsed. */
export function installChunkLoadRecovery(): void {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  window.addEventListener("vite:preloadError", (event) => {
    const preloadEvent = event as VitePreloadErrorEvent;
    if (recoverFromChunkLoadError(preloadEvent.payload ?? preloadEvent)) {
      preloadEvent.preventDefault();
    }
  });
}
