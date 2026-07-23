/**
 * Persist which Iberian hub airports are hidden on the map after repeated
 * empty connection periods.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DEFAULT_HIDE_AFTER = 3;

export function airportMapVisibilityPath(rootDir) {
  return join(rootDir, "public/data/airport-map-visibility.json");
}

export function emptyAirportMapVisibilityManifest() {
  return {
    generatedAt: new Date().toISOString(),
    hideAfterEmptyPeriods: DEFAULT_HIDE_AFTER,
    airports: {},
  };
}

export function loadAirportMapVisibility(rootDir) {
  const path = airportMapVisibilityPath(rootDir);
  if (!existsSync(path)) {
    return emptyAirportMapVisibilityManifest();
  }
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return {
      generatedAt: parsed.generatedAt ?? new Date().toISOString(),
      hideAfterEmptyPeriods:
        typeof parsed.hideAfterEmptyPeriods === "number"
          ? parsed.hideAfterEmptyPeriods
          : DEFAULT_HIDE_AFTER,
      airports: parsed.airports && typeof parsed.airports === "object" ? parsed.airports : {},
    };
  } catch {
    return emptyAirportMapVisibilityManifest();
  }
}

export function saveAirportMapVisibility(rootDir, manifest) {
  const path = airportMapVisibilityPath(rootDir);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
}
