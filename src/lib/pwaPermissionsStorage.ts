const DISMISSED_KEY = "pn_pwa_perms_dismissed_v1";
const ASKED_KEY = "pn_pwa_perms_asked_v1";

export function isPwaPermissionsPromptDismissed(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(DISMISSED_KEY) === "1";
}

export function dismissPwaPermissionsPrompt(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(DISMISSED_KEY, "1");
}

export function wasPwaPermissionsAsked(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(ASKED_KEY) === "1";
}

export function markPwaPermissionsAsked(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ASKED_KEY, "1");
}
