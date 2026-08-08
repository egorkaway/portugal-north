import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type IcaoIataMapFile = {
  byIata: Record<string, string>;
  byIcao: Record<string, string>;
};

let cached: IcaoIataMapFile | null = null;

function mapPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "../../data/airport-icao-iata.json");
}

export function loadAirportIcaoMap(): IcaoIataMapFile {
  if (cached) return cached;
  const raw = JSON.parse(readFileSync(mapPath(), "utf8")) as IcaoIataMapFile;
  cached = {
    byIata: raw.byIata ?? {},
    byIcao: raw.byIcao ?? {},
  };
  return cached;
}

/** Reset cached map (tests). */
export function resetAirportIcaoMapCache(): void {
  cached = null;
}

export function iataToIcao(iata: string): string | null {
  const code = iata.trim().toUpperCase();
  if (!code) return null;
  return loadAirportIcaoMap().byIata[code] ?? null;
}

export function icaoToIata(icao: string): string | null {
  const code = icao.trim().toUpperCase();
  if (!code) return null;
  return loadAirportIcaoMap().byIcao[code] ?? null;
}
