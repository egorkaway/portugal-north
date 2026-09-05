import type { Station } from "@/data/stations";
import { allStations } from "@/data/stationRegistry";
import { getExternalAirportPageIataSet } from "@/lib/externalAirportPages";
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
const destinationPageIatas = getExternalAirportPageIataSet();

// Iberian hubs always get station-page links. Europe destinations get pages
// only after both flight-connection maps exist.
for (const station of allStations) {
  const iata = extractAirportIata(station);
  if (!iata) continue;
  if (isAirportHubStation(station)) {
    airportStationPathByIata.set(iata, `/stations/${stationToSlug(station.name)}`);
    continue;
  }
  if (isAirportDestinationStation(station) && destinationPageIatas.has(iata)) {
    airportStationPathByIata.set(iata, `/stations/${stationToSlug(station.name)}`);
  }
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
export function showsTravelEsimPromo(station: Pick<Station, "name" | "types" | "lines">): boolean {
  if (isAirportDestinationStation(station)) {
    const iata = extractAirportIata(station);
    return Boolean(iata && destinationPageIatas.has(iata));
  }
  return isAirportHubStation(station) || AIRPORT_NAME_RE.test(station.name);
}
