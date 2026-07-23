/** Iberian hubs we sample outbound flights from (PT/ES catalog). */
export const AIRPORT_TYPE = "Airport";

/**
 * European airports reached by direct flights from Iberian hubs.
 * Shown on the map; outbound connections are never collected.
 */
export const AIRPORT_DESTINATION_TYPE = "Airport Destination";

export function isAirportMarkerType(type: string): boolean {
  return type === AIRPORT_TYPE || type === AIRPORT_DESTINATION_TYPE;
}

export function stationHasAirportType(station: { types: string[] }): boolean {
  return station.types.some(isAirportMarkerType);
}

export function isAirportHubStation(station: { types: string[] }): boolean {
  return station.types.includes(AIRPORT_TYPE);
}

export function isAirportDestinationStation(station: { types: string[] }): boolean {
  return station.types.includes(AIRPORT_DESTINATION_TYPE);
}

/** Coalesce destination airports under the Airport filter chip. */
export function normalizeStationTypeForFilter(type: string): string {
  return type === AIRPORT_DESTINATION_TYPE ? AIRPORT_TYPE : type;
}

export function stationMatchesTypeFilter(
  station: { types: string[] },
  activeFilter: string | null,
): boolean {
  if (!activeFilter) return true;
  if (activeFilter === AIRPORT_TYPE) return stationHasAirportType(station);
  return station.types.includes(activeFilter);
}
