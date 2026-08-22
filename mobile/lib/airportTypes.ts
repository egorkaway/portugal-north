export const AIRPORT_TYPE = 'Airport';
export const AIRPORT_DESTINATION_TYPE = 'Airport Destination';

export function isAirportHubStation(station: { types: string[] }): boolean {
  return station.types.includes(AIRPORT_TYPE);
}

export function isAirportDestinationStation(station: { types: string[] }): boolean {
  return station.types.includes(AIRPORT_DESTINATION_TYPE);
}
