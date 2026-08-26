import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import {
  CATALOG_ASSET_IDS,
  catalogAssetUrl,
  CATALOG_URL,
  parseCatalog,
  shouldCheckCatalog,
  type CatalogAssetId,
  type MobileCatalog,
} from '@/lib/catalogPolicy';
import { applyCatalogAssets } from '@/lib/stationData';
import { invalidateTrainLinesCache } from '@/lib/trainLines';
import { invalidateAirportSlugIndex } from '@/lib/airportConnections';
import { ensureStationsSpotlightIndex } from '@/lib/spotlightIndex';

const META_KEY = '@verystays/catalog/meta';
const assetKey = (id: CatalogAssetId) => `@verystays/catalog/asset/${id}`;

type CatalogMeta = {
  lastCheckAt: number | null;
  applied: Partial<Record<CatalogAssetId, string>>;
};

let lastAttemptAt: number | null = null;
let inFlight: Promise<void> | null = null;

async function readMeta(): Promise<CatalogMeta> {
  try {
    const raw = await AsyncStorage.getItem(META_KEY);
    if (!raw) return { lastCheckAt: null, applied: {} };
    const parsed = JSON.parse(raw) as Partial<CatalogMeta>;
    return {
      lastCheckAt: typeof parsed.lastCheckAt === 'number' ? parsed.lastCheckAt : null,
      applied: parsed.applied && typeof parsed.applied === 'object' ? parsed.applied : {},
    };
  } catch {
    return { lastCheckAt: null, applied: {} };
  }
}

async function writeMeta(meta: CatalogMeta): Promise<void> {
  await AsyncStorage.setItem(META_KEY, JSON.stringify(meta));
}

async function readAsset(id: CatalogAssetId): Promise<unknown | null> {
  try {
    const raw = await AsyncStorage.getItem(assetKey(id));
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

async function writeAsset(id: CatalogAssetId, value: unknown): Promise<void> {
  await AsyncStorage.setItem(assetKey(id), JSON.stringify(value));
}

function applyParsedAssets(assets: Partial<Record<CatalogAssetId, unknown>>): CatalogAssetId[] {
  const applied = applyCatalogAssets(assets);
  if (applied.includes('stations')) {
    invalidateTrainLinesCache();
    invalidateAirportSlugIndex();
    void ensureStationsSpotlightIndex();
  }
  return applied;
}

/** Load previously downloaded catalog files before the first screen renders. */
export async function hydrateCatalogFromDisk(): Promise<void> {
  if (Platform.OS === 'web') return;

  const meta = await readMeta();
  const parsed: Partial<Record<CatalogAssetId, unknown>> = {};
  await Promise.all(
    CATALOG_ASSET_IDS.map(async (id) => {
      if (!meta.applied[id]) return;
      const value = await readAsset(id);
      if (value != null) parsed[id] = value;
    }),
  );
  if (Object.keys(parsed).length > 0) applyParsedAssets(parsed);
}

async function fetchJson(url: string): Promise<unknown | null> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  return (await res.json()) as unknown;
}

async function downloadAsset(id: CatalogAssetId, catalog: MobileCatalog): Promise<unknown | null> {
  return fetchJson(catalogAssetUrl(catalog.assets[id]));
}

async function syncCatalogNow(): Promise<void> {
  const attemptedAt = Date.now();
  lastAttemptAt = attemptedAt;

  const catalog = parseCatalog(await fetchJson(`${CATALOG_URL}?t=${attemptedAt}`));
  if (!catalog) return;

  const meta = await readMeta();
  const toApply: Partial<Record<CatalogAssetId, unknown>> = {};
  let downloadFailed = false;

  for (const id of CATALOG_ASSET_IDS) {
    const remoteHash = catalog.assets[id].sha256;
    if (meta.applied[id] === remoteHash) continue;
    const payload = await downloadAsset(id, catalog);
    if (payload == null) {
      downloadFailed = true;
      continue;
    }
    toApply[id] = payload;
  }

  const appliedIds = applyParsedAssets(toApply);
  const nextApplied = { ...meta.applied };
  await Promise.all(appliedIds.map((id) => writeAsset(id, toApply[id])));
  for (const id of appliedIds) {
    nextApplied[id] = catalog.assets[id].sha256;
  }

  if (downloadFailed) {
    await writeMeta({ lastCheckAt: meta.lastCheckAt, applied: nextApplied });
    return;
  }

  lastAttemptAt = null;
  await writeMeta({ lastCheckAt: Date.now(), applied: nextApplied });
}

/** Fetch the website catalog at most once a day and overlay changed JSON. */
export function maybeSyncCatalog(): Promise<void> {
  if (Platform.OS === 'web') return Promise.resolve();
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const lastCheckAt = (await readMeta()).lastCheckAt;
    if (!shouldCheckCatalog({ lastCheckAt, lastAttemptAt })) return;
    await syncCatalogNow();
  })()
    .catch((error) => {
      console.warn('[catalog] sync failed', error);
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** Foreground + cold start: hydrate is separate; this only does the network check. */
export function startCatalogSyncListener(): () => void {
  void maybeSyncCatalog();
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') void maybeSyncCatalog();
  });
  return () => sub.remove();
}
