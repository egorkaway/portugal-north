import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

/** Tracks `navigator.onLine` with online/offline events. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getOnlineSnapshot, getServerSnapshot);
}
