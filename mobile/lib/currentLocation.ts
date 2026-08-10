import * as Location from 'expo-location';

const DEFAULT_TIMEOUT_MS = 8_000;

export type Coords = { lat: number; lng: number };

function toCoords(position: Location.LocationObject): Coords {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('location_timeout'));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * Resolve a current (or last-known) fix without hanging forever.
 * Emulators and cold GPS starts often never resolve `getCurrentPositionAsync`.
 */
export async function getCurrentCoords(options?: {
  timeoutMs?: number;
}): Promise<Coords | null> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    const lastKnown = await Location.getLastKnownPositionAsync();
    if (lastKnown) return toCoords(lastKnown);
  } catch {
    // Fall through to a fresh fix.
  }

  try {
    const position = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      timeoutMs,
    );
    return toCoords(position);
  } catch {
    return null;
  }
}
