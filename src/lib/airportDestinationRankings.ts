import { portugalAirports } from "@/data/portugal/airports";
import { spainAirports } from "@/data/spain/airports";
import type { Station } from "@/data/stationTypes";
import type { CountryCode } from "@/lib/countries";
import type { AirportConnectionsManifest } from "../../server/lib/airportConnections.js";
import {
  getAirportConnectionsMapImagePath,
  resolveAirportConnectionsEntry,
} from "@/lib/airportConnections";
import { stationToSlug } from "@/lib/stationSlug";

export type AirportDestinationRankingRow = {
  name: string;
  slug: string;
  iata: string;
  destinationCount: number;
  mapImage: string;
};

export type AirportDestinationRankingsByCountry = Record<
  CountryCode,
  AirportDestinationRankingRow | null
>;

function hubIata(airport: Station): string {
  return airport.lines[0]?.trim().toUpperCase() ?? "";
}

export function getAirportDestinationCount(
  manifest: AirportConnectionsManifest | null | undefined,
  airport: Station,
): number {
  const entry = resolveAirportConnectionsEntry(manifest, {
    iata: hubIata(airport),
    stationName: airport.name,
    slug: stationToSlug(airport.name),
  });
  return entry?.connections?.length ?? 0;
}

export function buildAirportDestinationRankingRows(
  airports: Station[],
  manifest: AirportConnectionsManifest | null | undefined,
): AirportDestinationRankingRow[] {
  return airports
    .map((airport) => {
      const iata = hubIata(airport);
      const slug = stationToSlug(airport.name);
      const entry = resolveAirportConnectionsEntry(manifest, {
        iata,
        stationName: airport.name,
        slug,
      });
      const destinationCount = entry?.connections?.length ?? 0;
      if (!iata || destinationCount <= 0 || !entry) return null;
      return {
        name: airport.name,
        slug,
        iata,
        destinationCount,
        mapImage: getAirportConnectionsMapImagePath(entry),
      };
    })
    .filter((row): row is AirportDestinationRankingRow => row !== null)
    .sort(
      (a, b) =>
        b.destinationCount - a.destinationCount ||
        a.name.localeCompare(b.name),
    );
}

export function pickBusiest(
  rows: AirportDestinationRankingRow[],
): AirportDestinationRankingRow | null {
  return rows[0] ?? null;
}

export function buildAirportDestinationRankingsByCountry(
  manifest: AirportConnectionsManifest | null | undefined,
): AirportDestinationRankingsByCountry {
  return {
    pt: pickBusiest(buildAirportDestinationRankingRows(portugalAirports, manifest)),
    es: pickBusiest(buildAirportDestinationRankingRows(spainAirports, manifest)),
  };
}
