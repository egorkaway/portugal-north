export type PermissionStatus = "granted" | "denied" | "prompt" | "unsupported";

export async function getLocationPermissionStatus(): Promise<PermissionStatus> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "unsupported";
  }

  if (!navigator.permissions?.query) {
    return "prompt";
  }

  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    if (result.state === "granted") return "granted";
    if (result.state === "denied") return "denied";
    return "prompt";
  } catch {
    return "prompt";
  }
}

export function getNotificationPermissionStatus(): PermissionStatus {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  switch (Notification.permission) {
    case "granted":
      return "granted";
    case "denied":
      return "denied";
    default:
      return "prompt";
  }
}

export function shouldOfferPwaPermissions(
  location: PermissionStatus,
  notifications: PermissionStatus,
): boolean {
  return location === "prompt" || notifications === "prompt";
}

export function requestLocationPermission(): Promise<PermissionStatus> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => resolve("granted"),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve("denied");
          return;
        }
        resolve("denied");
      },
      { enableHighAccuracy: false, timeout: 20_000, maximumAge: 0 },
    );
  });
}

export async function requestNotificationPermission(): Promise<PermissionStatus> {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  try {
    const result = await Notification.requestPermission();
    if (result === "granted") return "granted";
    if (result === "denied") return "denied";
    return "prompt";
  } catch {
    return "denied";
  }
}

/** Requests location, then notifications (short gap so browsers show both dialogs). */
export async function requestPwaPermissionsInSequence(): Promise<{
  location: PermissionStatus;
  notifications: PermissionStatus;
}> {
  const locationStatus = await getLocationPermissionStatus();
  const location =
    locationStatus === "prompt" ? await requestLocationPermission() : locationStatus;

  await new Promise((r) => setTimeout(r, 600));

  const notificationStatus = getNotificationPermissionStatus();
  const notifications =
    notificationStatus === "prompt"
      ? await requestNotificationPermission()
      : notificationStatus;

  return { location, notifications };
}
