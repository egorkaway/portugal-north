export type AirportRecord = {
  iata: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
};

const IATA_IN_NAME_RE = /\(([A-Z]{3})\)\s*$/;

export function extractIataFromAirportName(name: string): string | null {
  const match = name.match(IATA_IN_NAME_RE);
  return match?.[1] ?? null;
}

export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

export function getFlightLineColor(flightCount: number): string {
  if (flightCount >= 5) return "#b91c1c";
  if (flightCount >= 3) return "#7c3aed";
  return "#2563eb";
}

export function getFlightLineWeight(flightCount: number): number {
  if (flightCount >= 5) return 4;
  if (flightCount >= 3) return 3;
  return 2;
}
