import { cpStationCodes } from "../../src/data/cpStationCodes.js";
import { portugalStations } from "../../src/data/stations.js";

export type CpStationIndexEntry = {
  name: string;
  code: string;
  lines: string[];
  lat: number;
  lng: number;
};

const entries: CpStationIndexEntry[] = portugalStations.flatMap((station) => {
  const code = cpStationCodes[station.name];
  if (!code?.startsWith("94-")) return [];
  return [
    {
      name: station.name,
      code,
      lines: station.lines,
      lat: station.lat,
      lng: station.lng,
    },
  ];
});

const byCode = new Map(entries.map((entry) => [entry.code, entry]));
const byName = new Map(entries.map((entry) => [entry.name, entry]));

export function getCpStationIndex(): CpStationIndexEntry[] {
  return entries;
}

export function getCpStationByCode(code: string): CpStationIndexEntry | undefined {
  return byCode.get(code);
}

export function getCpStationByName(name: string): CpStationIndexEntry | undefined {
  return byName.get(name);
}

export function findCpStationByFuzzyName(name: string): CpStationIndexEntry | undefined {
  const direct = getCpStationByName(name);
  if (direct) return direct;

  const normalized = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!normalized) return undefined;

  return entries.find((entry) => {
    const candidate = entry.name
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    return (
      candidate === normalized ||
      candidate.includes(normalized) ||
      normalized.includes(candidate)
    );
  });
}
