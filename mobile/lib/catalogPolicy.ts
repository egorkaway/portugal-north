export const CATALOG_SCHEMA_VERSION = 1;
export const CATALOG_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
export const CATALOG_RETRY_AFTER_FAILURE_MS = 15 * 60 * 1000;
export const CATALOG_SITE_ORIGIN = 'https://www.verystays.com';
export const CATALOG_URL = `${CATALOG_SITE_ORIGIN}/data/mobile-catalog.json`;

export const CATALOG_ASSET_IDS = [
  'stations',
  'hotels',
  'stationImages',
  'pexelsPhotoCredits',
  'summariesEn',
  'summariesPt',
  'summariesEs',
  'summariesCa',
  'summariesGl',
  'cpStationCodes',
  'reliabilityScores',
  'spainReliabilityScores',
  'trainReliabilitySpotlight',
] as const;

export type CatalogAssetId = (typeof CATALOG_ASSET_IDS)[number];

export type CatalogAsset = {
  path: string;
  sha256: string;
  bytes: number;
};

export type MobileCatalog = {
  schemaVersion: number;
  generatedAt: string;
  assets: Record<CatalogAssetId, CatalogAsset>;
};

export type CatalogCheckInput = {
  lastCheckAt: number | null;
  lastAttemptAt?: number | null;
  now?: number;
  intervalMs?: number;
  retryAfterFailureMs?: number;
};

export function shouldCheckCatalog({
  lastCheckAt,
  lastAttemptAt = null,
  now = Date.now(),
  intervalMs = CATALOG_CHECK_INTERVAL_MS,
  retryAfterFailureMs = CATALOG_RETRY_AFTER_FAILURE_MS,
}: CatalogCheckInput): boolean {
  if (lastCheckAt == null || !Number.isFinite(lastCheckAt)) {
    if (lastAttemptAt != null && now - lastAttemptAt < retryAfterFailureMs) return false;
    return true;
  }
  if (now - lastCheckAt < intervalMs) return false;
  if (lastAttemptAt != null && now - lastAttemptAt < retryAfterFailureMs) return false;
  return true;
}

export function parseCatalog(data: unknown): MobileCatalog | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as Partial<MobileCatalog> & { assets?: Record<string, Partial<CatalogAsset>> };
  if (raw.schemaVersion !== CATALOG_SCHEMA_VERSION) return null;
  if (typeof raw.generatedAt !== 'string' || !raw.generatedAt) return null;
  if (!raw.assets || typeof raw.assets !== 'object') return null;

  const assets = {} as Record<CatalogAssetId, CatalogAsset>;
  for (const id of CATALOG_ASSET_IDS) {
    const asset = raw.assets[id];
    if (!asset || typeof asset !== 'object') return null;
    if (typeof asset.path !== 'string' || !asset.path.startsWith('/data/')) return null;
    if (typeof asset.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(asset.sha256)) return null;
    if (typeof asset.bytes !== 'number' || !Number.isFinite(asset.bytes) || asset.bytes <= 0) {
      return null;
    }
    assets[id] = { path: asset.path, sha256: asset.sha256, bytes: asset.bytes };
  }

  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    generatedAt: raw.generatedAt,
    assets,
  };
}

export function catalogAssetUrl(asset: CatalogAsset): string {
  return `${CATALOG_SITE_ORIGIN}${asset.path}?h=${asset.sha256}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function parseStationsPayload(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const stations = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.name !== 'string' || !item.name) return null;
    if (!Array.isArray(item.lines) || !Array.isArray(item.types)) return null;
    if (typeof item.lat !== 'number' || typeof item.lng !== 'number') return null;
    if (typeof item.country !== 'string' || !item.country) return null;
    stations.push({
      name: item.name,
      lines: item.lines.filter((line): line is string => typeof line === 'string'),
      types: item.types.filter((type): type is string => typeof type === 'string'),
      lat: item.lat,
      lng: item.lng,
      country: item.country,
    });
  }
  return stations;
}

export function parseStringRecord(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) return null;
  const next: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== 'string') return null;
    next[key] = entry;
  }
  return Object.keys(next).length > 0 ? next : null;
}

export function parseHotelsPayload(value: unknown) {
  if (!isRecord(value)) return null;
  const next: Record<
    string,
    { name: string; distanceKm: number; priceFrom: number; bookingUrl: string }[]
  > = {};
  for (const [stationName, hotels] of Object.entries(value)) {
    if (!Array.isArray(hotels)) return null;
    const list = [];
    for (const hotel of hotels) {
      if (!isRecord(hotel)) return null;
      if (typeof hotel.name !== 'string' || !hotel.name) return null;
      if (typeof hotel.distanceKm !== 'number' || typeof hotel.priceFrom !== 'number') return null;
      if (typeof hotel.bookingUrl !== 'string' || !hotel.bookingUrl) return null;
      list.push({
        name: hotel.name,
        distanceKm: hotel.distanceKm,
        priceFrom: hotel.priceFrom,
        bookingUrl: hotel.bookingUrl,
      });
    }
    next[stationName] = list;
  }
  return Object.keys(next).length > 0 ? next : null;
}

export function parseReliabilityPayload(value: unknown) {
  if (!isRecord(value) || !isRecord(value.scores)) return null;
  const scores: Record<string, number> = {};
  for (const [name, score] of Object.entries(value.scores)) {
    if (typeof score !== 'number' || !Number.isFinite(score)) return null;
    scores[name] = score;
  }
  const movements: Record<string, number> = {};
  if (value.movements && isRecord(value.movements)) {
    for (const [name, count] of Object.entries(value.movements)) {
      if (typeof count === 'number' && Number.isFinite(count)) movements[name] = count;
    }
  }
  return {
    generatedAt: typeof value.generatedAt === 'string' ? value.generatedAt : '',
    runCount: typeof value.runCount === 'number' ? value.runCount : 0,
    stationCount: typeof value.stationCount === 'number' ? value.stationCount : 0,
    scores,
    movements,
  };
}

export function parseTrainSpotlightPayload(value: unknown) {
  if (!isRecord(value)) return null;
  return value;
}

export function parsePexelsCreditsPayload(value: unknown) {
  if (!isRecord(value)) return null;
  const next: Record<
    string,
    { photographer: string; photographerUrl: string; photoPageUrl: string }
  > = {};
  for (const [id, credit] of Object.entries(value)) {
    if (!isRecord(credit)) return null;
    if (typeof credit.photographer !== 'string') return null;
    next[id] = {
      photographer: credit.photographer,
      photographerUrl: typeof credit.photographerUrl === 'string' ? credit.photographerUrl : '',
      photoPageUrl: typeof credit.photoPageUrl === 'string' ? credit.photoPageUrl : '',
    };
  }
  return next;
}
