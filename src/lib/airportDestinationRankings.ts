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

export type AirportDestinationCountryRankings = {
  busiest: AirportDestinationRankingRow | null;
  leastBusy: AirportDestinationRankingRow | null;
};

export type AirportDestinationRankingsByCountry = Record<
  CountryCode,
  AirportDestinationCountryRankings
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

export function pickBusiestAndLeastBusy(
  rows: AirportDestinationRankingRow[],
): AirportDestinationCountryRankings {
  if (rows.length === 0) {
    return { busiest: null, leastBusy: null };
  }

  const busiest = rows[0];
  const leastBusy = rows[rows.length - 1];
  return { busiest, leastBusy };
}

export function buildAirportDestinationRankingsByCountry(
  manifest: AirportConnectionsManifest | null | undefined,
): AirportDestinationRankingsByCountry {
  return {
    pt: pickBusiestAndLeastBusy(
      buildAirportDestinationRankingRows(portugalAirports, manifest),
    ),
    es: pickBusiestAndLeastBusy(
      buildAirportDestinationRankingRows(spainAirports, manifest),
    ),
  };
}
