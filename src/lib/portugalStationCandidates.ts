import { distanceKm } from "./geo";

export type PortugalGtfsStop = {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  scheduledStops: number;
  routeShortNames: string[];
};

export type ExistingCatalogStation = {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  lines?: string[];
  types?: string[];
};

export type PortugalStationCandidate = {
  name: string;
  code: string;
  lat: number;
  lng: number;
  scheduledStops: number;
  routeShortNames: string[];
  lines: string[];
  types: string[];
};

export const PORTUGAL_EXPAND_BATCH_SIZE = 1;
const NEAR_EXISTING_KM = 0.45;
const NEAR_SPAIN_KM = 2.5;
const NEAREST_LINE_KM = 35;

/** GTFS stop_name (unaccented) → catalog display name. */
export const PORTUGAL_GTFS_DISPLAY_NAMES: Record<string, string> = {
  "Sao Joao do Estoril": "São João do Estoril",
  "Sao Pedro do Estoril": "São Pedro do Estoril",
  "Venda do Alcaide": "Venda do Alcaide",
  "Praias do Sado-A": "Praias do Sado-A",
  "Formoselha - Santo Varao": "Formoselha – Santo Varão",
  Pereira: "Pereira",
  Bencanta: "Bencanta",
  Espadaneira: "Espadaneira",
  Ameal: "Ameal",
  Casais: "Casais",
  "Vila Pouca do Campo": "Vila Pouca do Campo",
  "Carvalheira - Maceda": "Carvalheira - Maceda",
  Regua: "Régua",
  "Casa Branca": "Casa Branca",
  Cacela: "Cacela",
  Conceicao: "Conceição",
  "Porta Nova": "Porta Nova",
  "Fuseta-A": "Fuseta-A",
  "Bom Joao": "Bom João",
  Montemor: "Montemor",
  "Monte Gordo": "Monte Gordo",
  "Castro Marim": "Castro Marim",
  Luz: "Luz",
  Livramento: "Livramento",
  Fuseta: "Fuseta",
  Cuba: "Cuba",
  Alvito: "Alvito",
  "Vila Nova da Baronia": "Vila Nova da Baronia",
  Alcacovas: "Alcáçovas",
  "Estombar - Lagoa": "Estômbar - Lagoa",
  Boliqueime: "Boliqueime",
  "Meia Praia": "Meia Praia",
  "Mexilhoeira Grande": "Mexilhoeira Grande",
  Ferragudo: "Ferragudo",
  "Poco Barreto": "Poço Barreto",
  Alcantarilha: "Alcantarilha",
  Algoz: "Algoz",
  "Parque das Cidades": "Parque das Cidades",
  Almancil: "Almancil",
  Malveira: "Malveira",
  Sabugo: "Sabugo",
  "Vila Franca das Naves": "Vila Franca das Naves",
  "Carregal do Sal": "Carregal do Sal",
  "Santa Comba Dao": "Santa Comba Dão",
  Mortagua: "Mortágua",
  Jerumelo: "Jerumelo",
  "Pedra Furada": "Pedra Furada",
  "Freixo de Numao - Mos do Douro": "Freixo de Numão - Mós do Douro",
  Vargelas: "Vargelas",
  Benquerencas: "Benquerenças",
  "Ermidas - Sado": "Ermidas - Sado",
  Grandola: "Grândola",
  "Santa Clara - Saboia": "Santa Clara - Sabóia",
  Funcheira: "Funcheira",
  "Moimenta - Alcafache": "Moimenta - Alcafache",
  "Canas - Felgueira": "Canas - Felgueira",
  "Oliveirinha - Cabanas": "Oliveirinha - Cabanas",
  Soito: "Soito",
  "Luso - Bucaco": "Luso - Buçaco",
  "Messines - Alte": "Messines - Alte",
  "Sao Joao das Craveiras": "São João das Craveiras",
  Pegoes: "Pegões",
  "Fernando Po": "Fernando Pó",
  Poceirao: "Poceirão",
  Aldeia: "Aldeia",
  Freineda: "Freineda",
  Miuzela: "Miuzela",
  Cerdeira: "Cerdeira",
  Rochoso: "Rochoso",
  "Vila Fernando": "Vila Fernando",
  Gata: "Gata",
  Papizios: "Papízios",
  Castelejo: "Castelejo",
  "Monte de Lobos": "Monte de Lobos",
  Vacarica: "Vacariça",
  "Santa Eulalia-A": "Santa Eulália-A",
  Arronches: "Arronches",
  Assumar: "Assumar",
  Crato: "Crato",
  Chanca: "Chança",
  "Torre das Vargens": "Torre das Vargens",
  "Ponte de Sor": "Ponte de Sor",
  Bemposta: "Bemposta",
  "Amoreiras - Odemira": "Amoreiras - Odemira",
  Baracal: "Baracal",
};

const GTFS_LINE_NAME: Record<string, string> = {
  "Linha de Cascais": "Linha de Cascais",
  "Linha do Sado": "Linha do Sado",
  "Linha de Aveiro": "Linha do Norte",
  "Linha de Leixoes": "Linha de Leixões",
  "Linha do Marco": "Linha do Douro",
};

const CODE_PREFIX_LINES: { start: number; end: number; lines: string[] }[] = [
  { start: 10_000, end: 11_999, lines: ["Linha do Douro"] },
  { start: 35_000, end: 35_999, lines: ["Linha do Norte"] },
  { start: 38_000, end: 38_999, lines: ["Linha do Norte"] },
  { start: 46_000, end: 49_999, lines: ["Linha da Beira Alta"] },
  { start: 52_000, end: 52_999, lines: ["Linha da Beira Baixa"] },
  { start: 55_000, end: 57_999, lines: ["Linha do Leste"] },
  { start: 62_000, end: 62_999, lines: ["Linha do Oeste"] },
  { start: 65_000, end: 65_999, lines: ["Ramal de Alfarelos"] },
  { start: 68_000, end: 68_999, lines: ["Linha do Sul"] },
  { start: 69_000, end: 69_999, lines: ["Linha de Cascais"] },
  { start: 71_000, end: 71_999, lines: ["Linha do Alentejo"] },
  { start: 73_000, end: 73_999, lines: ["Linha do Algarve"] },
  { start: 74_000, end: 74_999, lines: ["Linha do Alentejo"] },
  { start: 77_000, end: 77_999, lines: ["Linha do Sul"] },
  { start: 78_000, end: 78_999, lines: ["Linha do Algarve"] },
  { start: 90_000, end: 90_999, lines: ["Linha do Algarve"] },
  { start: 91_000, end: 91_999, lines: ["Linha do Sado"] },
  { start: 92_000, end: 93_999, lines: ["Linha do Sul"] },
];

export function cpCodeFromGtfsStopId(id: string): string {
  return id.replaceAll("_", "-");
}

export function foldPortugalStationName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(estacao|estacao ferroviaria|apeadeiro|de|da|do|das|dos)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function displayPortugalStopName(raw: string): string {
  const trimmed = raw.replace(/\s+/g, " ").trim();
  if (PORTUGAL_GTFS_DISPLAY_NAMES[trimmed]) return PORTUGAL_GTFS_DISPLAY_NAMES[trimmed];
  if (PORTUGAL_GTFS_DISPLAY_NAMES[raw]) return PORTUGAL_GTFS_DISPLAY_NAMES[raw];
  return trimmed;
}

/** True when the GTFS name is the same halt as a catalog name (Régua ⊂ Peso da Régua). */
export function isGtfsAliasOfCatalog(gtfsName: string, catalogName: string): boolean {
  const gtfs = foldPortugalStationName(gtfsName);
  const catalog = foldPortugalStationName(catalogName);
  if (!gtfs || !catalog) return false;
  if (gtfs === catalog) return true;
  return catalog.startsWith(`${gtfs} `) || catalog.endsWith(` ${gtfs}`);
}

export function typesFromRouteShortNames(names: Iterable<string>): string[] {
  const set = new Set(names);
  const types: string[] = [];
  if (set.has("AP")) types.push("Alfa Pendular");
  if (set.has("IC")) types.push("Intercidades");
  if (set.has("IR") || set.has("R")) types.push("Regional");
  const urban =
    set.has("U") || [...set].some((name) => name.startsWith("Linha "));
  if (urban) types.push("Urban");
  return types.length ? types : ["Regional"];
}

function numericCpCode(code: string): number | null {
  const match = code.match(/^94-(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
}

function linesFromCodePrefix(code: string): string[] {
  const numeric = numericCpCode(code);
  if (numeric == null) return [];
  const hit = CODE_PREFIX_LINES.find((row) => numeric >= row.start && numeric <= row.end);
  return hit?.lines ?? [];
}

function linesFromRouteShortNames(names: Iterable<string>): string[] {
  const lines: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const mapped = GTFS_LINE_NAME[raw];
    if (!mapped || seen.has(mapped)) continue;
    seen.add(mapped);
    lines.push(mapped);
  }
  return lines;
}

function nearestPortugalLines(
  lat: number,
  lng: number,
  existing: ExistingCatalogStation[],
): string[] {
  let best: ExistingCatalogStation | null = null;
  let bestKm = Infinity;
  for (const station of existing) {
    if (station.country && station.country !== "pt") continue;
    if (/\(Metro\)/i.test(station.name)) continue;
    if (station.types?.some((type) => /airport/i.test(type))) continue;
    if (!Number.isFinite(station.lat) || !Number.isFinite(station.lng)) continue;
    const km = distanceKm(lat, lng, station.lat, station.lng);
    if (km < bestKm) {
      bestKm = km;
      best = station;
    }
  }
  if (!best || bestKm > NEAREST_LINE_KM) return [];
  return (best.lines ?? []).filter((line) => !/historic/i.test(line));
}

export function linesAndTypesForPortugalStop(
  stop: Pick<PortugalGtfsStop, "code" | "lat" | "lng" | "routeShortNames">,
  existing: ExistingCatalogStation[],
): { lines: string[]; types: string[] } {
  const types = typesFromRouteShortNames(stop.routeShortNames);
  const fromGtfs = linesFromRouteShortNames(stop.routeShortNames);
  const fromPrefix = linesFromCodePrefix(stop.code);
  const fromNearest = nearestPortugalLines(stop.lat, stop.lng, existing);
  const lines = fromGtfs.length ? fromGtfs : fromPrefix.length ? fromPrefix : fromNearest;
  return { lines: lines.length ? lines : ["Linha do Norte"], types };
}

function isGenericStopName(name: string): boolean {
  const folded = foldPortugalStationName(name);
  if (folded.length < 3) return true;
  if (/^\d+$/.test(folded)) return true;
  return /^(apeadeiro|estacao)$/.test(folded);
}

function tooClose(
  lat: number,
  lng: number,
  stations: ExistingCatalogStation[],
  maxKm: number,
  predicate: (station: ExistingCatalogStation) => boolean = () => true,
): boolean {
  return stations.some(
    (station) =>
      predicate(station) &&
      Number.isFinite(station.lat) &&
      Number.isFinite(station.lng) &&
      distanceKm(lat, lng, station.lat, station.lng) < maxKm,
  );
}

export function pickNextPortugalStations(options: {
  stops: PortugalGtfsStop[];
  existing: ExistingCatalogStation[];
  existingCodes?: Iterable<string>;
  limit?: number;
}): PortugalStationCandidate[] {
  const limit = options.limit ?? PORTUGAL_EXPAND_BATCH_SIZE;
  const existingCodes = new Set(
    [...(options.existingCodes ?? [])].map((code) => code.replaceAll("_", "-")),
  );
  const existingNames = options.existing.map((station) => station.name);

  const ranked = options.stops
    .map((stop) => {
      const code = stop.code || cpCodeFromGtfsStopId(stop.id);
      const name = displayPortugalStopName(stop.name);
      return { stop, code, name };
    })
    .filter(({ stop, code, name }) => {
      if (!code || !name || isGenericStopName(name)) return false;
      if (existingCodes.has(code)) return false;
      const folded = foldPortugalStationName(name);
      if (!folded) return false;
      if (existingNames.some((existing) => foldPortugalStationName(existing) === folded)) {
        return false;
      }
      if (existingNames.some((existing) => isGtfsAliasOfCatalog(name, existing))) {
        return false;
      }
      if (tooClose(stop.lat, stop.lng, options.existing, NEAR_EXISTING_KM)) return false;
      if (
        tooClose(
          stop.lat,
          stop.lng,
          options.existing,
          NEAR_SPAIN_KM,
          (station) => station.country === "es",
        )
      ) {
        return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        b.stop.scheduledStops - a.stop.scheduledStops || a.name.localeCompare(b.name, "pt"),
    );

  const picked: PortugalStationCandidate[] = [];
  for (const row of ranked) {
    if (picked.length >= limit) break;
    if (tooClose(row.stop.lat, row.stop.lng, picked, NEAR_EXISTING_KM)) continue;
    if (picked.some((item) => foldPortugalStationName(item.name) === foldPortugalStationName(row.name))) {
      continue;
    }
    const { lines, types } = linesAndTypesForPortugalStop(row.stop, options.existing);
    picked.push({
      name: row.name,
      code: row.code,
      lat: Math.round(row.stop.lat * 10_000) / 10_000,
      lng: Math.round(row.stop.lng * 10_000) / 10_000,
      scheduledStops: row.stop.scheduledStops,
      routeShortNames: [...row.stop.routeShortNames],
      lines,
      types,
    });
  }
  return picked;
}
