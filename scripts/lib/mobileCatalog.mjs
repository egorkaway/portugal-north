/**
 * Publish a hashed catalog so the mobile app can OTA-refresh bundled JSON.
 *
 * Catalog: public/data/mobile-catalog.json
 * Copied assets: public/data/mobile/*.json
 * Reliability files stay at their existing public/data/ URLs.
 */
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

export const MOBILE_CATALOG_SCHEMA_VERSION = 1;
export const MOBILE_CATALOG_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
export const MOBILE_CATALOG_RETRY_AFTER_FAILURE_MS = 15 * 60 * 1000;
export const MOBILE_CATALOG_PUBLIC_PATH = "/data/mobile-catalog.json";

/** JSON copied from mobile/data into public/data/mobile/. */
export const MOBILE_CATALOG_COPIED_ASSETS = {
  stations: {
    source: "mobile/data/stations-full.json",
    path: "/data/mobile/stations-full.json",
  },
  hotels: {
    source: "mobile/data/hotels.json",
    path: "/data/mobile/hotels.json",
  },
  stationImages: {
    source: "mobile/data/stationImages.json",
    path: "/data/mobile/stationImages.json",
  },
  pexelsPhotoCredits: {
    source: "mobile/data/pexelsPhotoCredits.json",
    path: "/data/mobile/pexelsPhotoCredits.json",
  },
  summariesEn: {
    source: "mobile/data/summaries-en.json",
    path: "/data/mobile/summaries-en.json",
  },
  summariesPt: {
    source: "mobile/data/summaries-pt.json",
    path: "/data/mobile/summaries-pt.json",
  },
  summariesEs: {
    source: "mobile/data/summaries-es.json",
    path: "/data/mobile/summaries-es.json",
  },
  summariesCa: {
    source: "mobile/data/summaries-ca.json",
    path: "/data/mobile/summaries-ca.json",
  },
  summariesGl: {
    source: "mobile/data/summaries-gl.json",
    path: "/data/mobile/summaries-gl.json",
  },
  cpStationCodes: {
    source: "mobile/data/cpStationCodes.json",
    path: "/data/mobile/cpStationCodes.json",
  },
};

/** Already published for the website; catalog points at these paths. */
export const MOBILE_CATALOG_PUBLIC_ASSETS = {
  reliabilityScores: {
    source: "public/data/reliability-scores.json",
    path: "/data/reliability-scores.json",
  },
  spainReliabilityScores: {
    source: "public/data/spain-reliability-scores.json",
    path: "/data/spain-reliability-scores.json",
  },
  trainReliabilitySpotlight: {
    source: "public/data/train-reliability-spotlight.json",
    path: "/data/train-reliability-spotlight.json",
  },
};

export function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function shouldCheckMobileCatalog({
  lastCheckAt,
  lastAttemptAt = null,
  now = Date.now(),
  intervalMs = MOBILE_CATALOG_CHECK_INTERVAL_MS,
  retryAfterFailureMs = MOBILE_CATALOG_RETRY_AFTER_FAILURE_MS,
} = {}) {
  if (lastCheckAt == null || !Number.isFinite(lastCheckAt)) {
    if (lastAttemptAt != null && now - lastAttemptAt < retryAfterFailureMs) return false;
    return true;
  }
  if (now - lastCheckAt < intervalMs) return false;
  if (lastAttemptAt != null && now - lastAttemptAt < retryAfterFailureMs) return false;
  return true;
}

export function parseMobileCatalog(data) {
  if (!data || typeof data !== "object") return null;
  if (data.schemaVersion !== MOBILE_CATALOG_SCHEMA_VERSION) return null;
  if (typeof data.generatedAt !== "string" || !data.generatedAt) return null;
  if (!data.assets || typeof data.assets !== "object") return null;

  const required = [
    ...Object.keys(MOBILE_CATALOG_COPIED_ASSETS),
    ...Object.keys(MOBILE_CATALOG_PUBLIC_ASSETS),
  ];
  const assets = {};
  for (const id of required) {
    const asset = data.assets[id];
    if (!asset || typeof asset !== "object") return null;
    if (typeof asset.path !== "string" || !asset.path.startsWith("/data/")) return null;
    if (typeof asset.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(asset.sha256)) return null;
    if (typeof asset.bytes !== "number" || !Number.isFinite(asset.bytes) || asset.bytes <= 0) {
      return null;
    }
    assets[id] = {
      path: asset.path,
      sha256: asset.sha256,
      bytes: asset.bytes,
    };
  }

  return {
    schemaVersion: MOBILE_CATALOG_SCHEMA_VERSION,
    generatedAt: data.generatedAt,
    assets,
  };
}

function catalogAssetFromFile(absPath, publishedPath) {
  const bytes = readFileSync(absPath);
  return {
    path: publishedPath,
    sha256: sha256Hex(bytes),
    bytes: bytes.length,
  };
}

/**
 * Copy bundled mobile JSON into public/data/mobile/ and write mobile-catalog.json.
 * @param {string} rootDir
 * @param {{ generatedAt?: string }} [options]
 */
export function publishMobileCatalogFromBundle(rootDir, options = {}) {
  const assets = {};

  for (const [id, spec] of Object.entries(MOBILE_CATALOG_COPIED_ASSETS)) {
    const sourcePath = join(rootDir, spec.source);
    const destPath = join(rootDir, "public", spec.path.replace(/^\//, ""));
    mkdirSync(dirname(destPath), { recursive: true });
    copyFileSync(sourcePath, destPath);
    assets[id] = catalogAssetFromFile(destPath, spec.path);
  }

  for (const [id, spec] of Object.entries(MOBILE_CATALOG_PUBLIC_ASSETS)) {
    assets[id] = catalogAssetFromFile(join(rootDir, spec.source), spec.path);
  }

  const catalog = {
    schemaVersion: MOBILE_CATALOG_SCHEMA_VERSION,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    assets,
  };

  const catalogPath = join(rootDir, "public", MOBILE_CATALOG_PUBLIC_PATH.replace(/^\//, ""));
  mkdirSync(dirname(catalogPath), { recursive: true });
  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  return catalog;
}
