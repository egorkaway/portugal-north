import type { AirportMapVisibilityManifest } from "../../server/lib/airportMapVisibility";
import {
  hiddenAirportIatas,
  isAirportHiddenFromMap,
} from "../../server/lib/airportMapVisibility";

export type {
  AirportMapVisibilityEntry,
  AirportMapVisibilityManifest,
} from "../../server/lib/airportMapVisibility";

export {
  AIRPORT_MAP_HIDE_EMPTY_PERIODS,
  hiddenAirportIatas,
  isAirportHiddenFromMap,
} from "../../server/lib/airportMapVisibility";

let cachedManifest: AirportMapVisibilityManifest | null | undefined;

/** Load baked visibility manifest (Vite can import JSON from public via fetch on web). */
export async function fetchAirportMapVisibility(): Promise<AirportMapVisibilityManifest | null> {
  if (cachedManifest !== undefined) return cachedManifest;
  try {
    const res = await fetch("/data/airport-map-visibility.json", { cache: "no-store" });
    if (!res.ok) {
      cachedManifest = null;
      return null;
    }
    cachedManifest = (await res.json()) as AirportMapVisibilityManifest;
    return cachedManifest;
  } catch {
    cachedManifest = null;
    return null;
  }
}

export function getHiddenAirportIatasSync(
  manifest: AirportMapVisibilityManifest | null | undefined,
): Set<string> {
  return hiddenAirportIatas(manifest);
}

export function airportIataHiddenOnMap(
  manifest: AirportMapVisibilityManifest | null | undefined,
  iata: string,
): boolean {
  return isAirportHiddenFromMap(manifest, iata);
}
