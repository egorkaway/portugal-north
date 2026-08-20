import { distanceKm } from "./geo";
import { normalizeSpainStopId } from "../data/spainAdifStopIds";
import type { SpainTrainKind } from "./spainTrainPositions";

export type SpainGtfsStop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: SpainTrainKind;
};

export type ExistingCatalogStation = {
  name: string;
  lat: number;
  lng: number;
  country?: string;
};

export type SpainStopObservation = {
  stopId: string;
  kind: SpainTrainKind;
};

export type SpainStationCandidate = {
  name: string;
  lat: number;
  lng: number;
  stopIds: string[];
  kinds: SpainTrainKind[];
  observations: number;
  lines: string[];
  types: string[];
};

export const SPAIN_EXPAND_BATCH_SIZE = 1;
const NEAR_EXISTING_KM = 0.45;
const NEAR_PORTUGAL_KM = 2.5;

export function foldSpainStationName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(estacion|estacio|apeadero|apeadeiro|de|del|da|do|la|las|los|el)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function displaySpainStopName(raw: string): string {
  let name = raw.replace(/\s+/g, " ").trim();
  name = name.replace(/-(Clara Campoamor|Almudena Grandes|Daniel Castelao)$/i, "").trim();
  name = name.replace(/\s+-\s+/g, "-");
  if (name === name.toUpperCase()) {
    name = name
      .toLowerCase()
      .replace(/(^|[\s\-/])([A-Za-zÀ-ÿ])/g, (_, sep: string, ch: string) => `${sep}${ch.toUpperCase()}`);
  }
  return name;
}

export function linesAndTypesForKinds(kinds: Iterable<SpainTrainKind>): {
  lines: string[];
  types: string[];
} {
  const set = new Set(kinds);
  const lines: string[] = [];
  const types: string[] = [];
  if (set.has("cercanias")) {
    lines.push("Cercanías");
    types.push("Urban");
  }
  if (set.has("longDistance")) {
    lines.push("Larga distancia");
    types.push("Intercidades");
  }
  return { lines, types };
}

function isGenericStopName(name: string): boolean {
  const folded = foldSpainStationName(name);
  if (folded.length < 3) return true;
  if (/^\d+$/.test(folded)) return true;
  return /^(anden|andana|apeadero|apeadeiro|apeadero apeadero)$/.test(folded);
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

export function pickNextSpainStations(options: {
  stops: SpainGtfsStop[];
  observations: SpainStopObservation[];
  existing: ExistingCatalogStation[];
  limit?: number;
}): SpainStationCandidate[] {
  const limit = options.limit ?? SPAIN_EXPAND_BATCH_SIZE;
  const existingNames = new Set(options.existing.map((station) => foldSpainStationName(station.name)));
  const stopsById = new Map<string, SpainGtfsStop[]>();
  for (const stop of options.stops) {
    const id = normalizeSpainStopId(stop.id);
    const list = stopsById.get(id) ?? [];
    list.push(stop);
    stopsById.set(id, list);
  }

  const grouped = new Map<
    string,
    {
      name: string;
      lat: number;
      lng: number;
      stopIds: Set<string>;
      kinds: Set<SpainTrainKind>;
      observations: number;
    }
  >();

  for (const observation of options.observations) {
    const matches = stopsById.get(normalizeSpainStopId(observation.stopId));
    if (!matches?.length) continue;
    for (const stop of matches) {
      const name = displaySpainStopName(stop.name);
      if (isGenericStopName(name)) continue;
      const key = foldSpainStationName(name);
      if (!key || existingNames.has(key)) continue;
      if (tooClose(stop.lat, stop.lng, options.existing, NEAR_EXISTING_KM)) continue;
      if (
        tooClose(
          stop.lat,
          stop.lng,
          options.existing,
          NEAR_PORTUGAL_KM,
          (station) => station.country === "pt",
        )
      ) {
        continue;
      }

      let group = grouped.get(key);
      if (!group) {
        group = {
          name,
          lat: stop.lat,
          lng: stop.lng,
          stopIds: new Set(),
          kinds: new Set(),
          observations: 0,
        };
        grouped.set(key, group);
      }
      group.stopIds.add(normalizeSpainStopId(stop.id));
      group.kinds.add(observation.kind);
      group.kinds.add(stop.kind);
      group.observations += 1;
    }
  }

  const ranked = [...grouped.values()]
    .map((group) => {
      const { lines, types } = linesAndTypesForKinds(group.kinds);
      return {
        name: group.name,
        lat: Math.round(group.lat * 10_000) / 10_000,
        lng: Math.round(group.lng * 10_000) / 10_000,
        stopIds: [...group.stopIds].sort(),
        kinds: [...group.kinds],
        observations: group.observations,
        lines,
        types,
      };
    })
    .sort(
      (a, b) =>
        b.observations - a.observations || a.name.localeCompare(b.name, "es"),
    );

  const picked: SpainStationCandidate[] = [];
  for (const candidate of ranked) {
    if (picked.length >= limit) break;
    if (tooClose(candidate.lat, candidate.lng, picked, NEAR_EXISTING_KM)) continue;
    if (picked.some((row) => foldSpainStationName(row.name) === foldSpainStationName(candidate.name))) {
      continue;
    }
    picked.push(candidate);
  }
  return picked;
}
