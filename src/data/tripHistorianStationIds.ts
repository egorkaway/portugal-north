/** TripHistorian hub IDs for /stations/:id. Regenerate: node scripts/map-triphistorian-stations.mjs */
export const TRIP_HISTORIAN_BASE = "https://triphistorian.com";

export const tripHistorianStationIds: Partial<Record<string, number>> = {
  "Aveiro": 12675,
  "Braga": 12669,
  "Coimbra": 12674,
  "Porto-Campanhã": 12671,
  "São Bento (Porto)": 12670,
  "Viana do Castelo": 12676,
};

export function getTripHistorianStationUrl(stationName: string): string | undefined {
  const id = tripHistorianStationIds[stationName];
  if (id == null) return undefined;
  return `${TRIP_HISTORIAN_BASE}/stations/${id}`;
}
