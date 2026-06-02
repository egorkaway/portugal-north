import type { Station } from "@/data/stations";

/** Affiliate landing page shown on airport station pages only. */
export const YESIM_AIRPORT_URL = "https://yesim.tpx.gr/PHyO6Wrd";

const AIRPORT_NAME_RE = /\b(aeroporto|airport)\b/i;

/** Metro (or other) stations that serve an airport. */
export function isAirportStation(station: Pick<Station, "name">): boolean {
  return AIRPORT_NAME_RE.test(station.name);
}
