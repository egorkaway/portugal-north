const PWA_JUST_INSTALLED_KEY = "pn_pwa_just_installed";

type NavigatorStandalone = Navigator & { standalone?: boolean };

/** True when the app runs in an installed PWA context (home screen / installed app). */
export function isPwaStandalone(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as NavigatorStandalone;
  if (nav.standalone) return true;

  const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
  return modes.some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches);
}

export function wasPwaJustInstalled(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(PWA_JUST_INSTALLED_KEY) === "1";
}

export function markPwaJustInstalled(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PWA_JUST_INSTALLED_KEY, "1");
}

/** Installed PWA window, or browser tab right after the install event. */
export function isPwaInstalledContext(): boolean {
  return isPwaStandalone() || wasPwaJustInstalled();
}

const listeners = new Set<() => void>();

export function subscribePwaInstall(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  listeners.add(callback);

  const onAppInstalled = () => {
    markPwaJustInstalled();
    listeners.forEach((l) => l());
  };

  window.addEventListener("appinstalled", onAppInstalled);

  const media = window.matchMedia("(display-mode: standalone)");
  const onDisplayModeChange = () => listeners.forEach((l) => l());
  media.addEventListener?.("change", onDisplayModeChange);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("appinstalled", onAppInstalled);
    media.removeEventListener?.("change", onDisplayModeChange);
  };
}
