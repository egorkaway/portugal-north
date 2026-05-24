const CP_FE_CONFIG_URL = "https://www.cp.pt/fe-config.json";
const CACHE_TTL_MS = 45 * 60 * 1000;

type CpFeConfig = {
  travelApiUrl: string;
  travelApiKey: string;
  xcck: string;
  xccs: string;
};

let cache: { config: CpFeConfig; fetchedAt: number } | null = null;

export async function getCpTravelConfig(): Promise<CpFeConfig> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.config;
  }

  const res = await fetch(CP_FE_CONFIG_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`cp_config_http_${res.status}`);
  }

  const raw = (await res.json()) as CpFeConfig;
  if (!raw.travelApiUrl || !raw.travelApiKey || !raw.xcck || !raw.xccs) {
    throw new Error("cp_config_incomplete");
  }

  cache = { config: raw, fetchedAt: Date.now() };
  return raw;
}

export function cpAuthHeaders(config: CpFeConfig): HeadersInit {
  return {
    Accept: "application/json",
    "x-api-key": config.travelApiKey,
    "x-cp-connect-id": config.xcck,
    "x-cp-connect-secret": config.xccs,
    Origin: "https://www.cp.pt",
    Referer: "https://www.cp.pt/",
  };
}
