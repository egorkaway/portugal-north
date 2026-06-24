import type { Station } from "@/data/stations";

/** Affiliate landing page shown on airport station pages only. */
export const YESIM_AIRPORT_URL = "https://yesim.tpx.gr/PHyO6Wrd";

const AIRPORT_NAME_RE = /\b(aeroporto|aeropuerto|airport)\b/i;

function hasAirportType(station: Pick<Station, "types">): boolean {
  return station.types.includes("Airport");
}

/** Metro (or other) stations that serve an airport, or dedicated airport listings. */
export function isAirportStation(station: Pick<Station, "name" | "types">): boolean {
  return hasAirportType(station) || AIRPORT_NAME_RE.test(station.name);
}

/** Whether the Yesim travel eSIM promo should render on this station page. */
export function showsTravelEsimPromo(station: Pick<Station, "name" | "types">): boolean {
  return isAirportStation(station);
}
