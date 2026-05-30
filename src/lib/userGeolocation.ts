export type UserCoords = { lat: number; lng: number };

export type GeolocationFailure = "denied" | "error" | "unsupported";

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 0,
};

/** Result of a cancellable geolocation request. */
export type GeolocationRequest = {
  cancel: () => void;
};

/**
 * Acquire the user's position. Uses watchPosition plus getCurrentPosition because
 * iOS Safari often ignores getCurrentPosition alone unless both are used.
 */
export function startUserGeolocation(handlers: {
  onSuccess: (coords: UserCoords) => void;
  onFailure: (reason: GeolocationFailure) => void;
  isCancelled: () => boolean;
}): GeolocationRequest {
  if (!navigator.geolocation) {
    handlers.onFailure("unsupported");
    return { cancel: () => {} };
  }

  let settled = false;
  let watchId: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    if (watchId != null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const finish = () => {
    settled = true;
    cleanup();
  };

  const cancel = () => {
    if (settled || handlers.isCancelled()) return;
    finish();
  };

  const onSuccess = (position: GeolocationPosition) => {
    if (settled || handlers.isCancelled()) return;
    finish();
    handlers.onSuccess({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };

  const onError = (error: GeolocationPositionError) => {
    if (settled || handlers.isCancelled()) return;
    finish();
    handlers.onFailure(
      error.code === error.PERMISSION_DENIED ? "denied" : "error",
    );
  };

  watchId = navigator.geolocation.watchPosition(onSuccess, onError, GEO_OPTIONS);
  navigator.geolocation.getCurrentPosition(onSuccess, onError, GEO_OPTIONS);

  timeoutId = setTimeout(() => {
    if (settled || handlers.isCancelled()) return;
    finish();
    handlers.onFailure("error");
  }, 20_000);

  return { cancel };
}
