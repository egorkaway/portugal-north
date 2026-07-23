import type { Station } from "@/data/stations";
import { allStations } from "@/data/stationRegistry";
import { stationToSlug } from "@/lib/stationSlug";
import {
  isAirportDestinationStation,
  isAirportHubStation,
  stationHasAirportType,
} from "@/lib/airportTypes";

/** Affiliate landing page shown on airport station pages only. */
export const YESIM_AIRPORT_URL = "https://yesim.tpx.gr/PHyO6Wrd";

const AIRPORT_NAME_RE = /\b(aeroporto|aeropuerto|airport)\b/i;
const IATA_IN_NAME_RE = /\(([A-Z]{3})\)\s*$/;

function extractAirportIata(station: Pick<Station, "name" | "lines">): string | null {
  const fromLine = station.lines[0]?.trim().toUpperCase();
  if (fromLine && /^[A-Z]{3}$/.test(fromLine)) return fromLine;
  return station.name.match(IATA_IN_NAME_RE)?.[1] ?? null;
}

const airportStationPathByIata = new Map<string, string>();

for (const station of allStations) {
  if (!stationHasAirportType(station)) continue;
  const iata = extractAirportIata(station);
  if (!iata) continue;
  airportStationPathByIata.set(iata, `/stations/${stationToSlug(station.name)}`);
}

/** Station page path for catalog airports, keyed by IATA (e.g. MAD → /stations/madrid-barajas-airport-mad). */
export function getAirportStationPathByIata(iata: string): string | undefined {
  return airportStationPathByIata.get(iata.trim().toUpperCase());
}

/** Metro (or other) stations that serve an airport, or dedicated airport listings. */
export function isAirportStation(station: Pick<Station, "name" | "types">): boolean {
  return stationHasAirportType(station) || AIRPORT_NAME_RE.test(station.name);
}

/** Whether the Yesim travel eSIM promo should render on this station page. */
export function showsTravelEsimPromo(station: Pick<Station, "name" | "types">): boolean {
  // Europe destination airports are map markers only — keep promo on Iberian hubs / metro airports.
  if (isAirportDestinationStation(station)) return false;
  return isAirportHubStation(station) || AIRPORT_NAME_RE.test(station.name);
}
