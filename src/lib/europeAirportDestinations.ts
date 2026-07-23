/**
 * Europe destination airports: places with direct flights FROM Iberian hub
 * airports (PT/ES catalog) that are not themselves hubs we collect from.
 *
 * Inclusion rules:
 * - ISO country is in Europe (see EUROPE_ISO_COUNTRIES)
 * - IATA is not in the Iberian hub catalog
 * - For PT/ES: only non-mainland (islands / Ceuta / Melilla). Mainland PT/ES
 *   airports stay hub-only or omitted; we never promote them to destinations.
 */

export type AirportCoordinate = {
  name: string;
  country: string;
  lat: number;
  lng: number;
};

/** ISO 3166-1 alpha-2 countries treated as Europe for destination upsert. */
export const EUROPE_ISO_COUNTRIES = new Set([
  "AL",
  "AD",
  "AT",
  "BA",
  "BE",
  "BG",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GG",
  "GI",
  "GR",
  "HR",
  "HU",
  "IE",
  "IM",
  "IS",
  "IT",
  "JE",
  "LI",
  "LT",
  "LU",
  "LV",
  "MC",
  "MD",
  "ME",
  "MK",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "RS",
  "SE",
  "SI",
  "SK",
  "SM",
  "UA",
  "VA",
  "XK",
]);

/**
 * Non-mainland Portugal/Spain: Atlantic islands, Balearics, Ceuta, Melilla.
 * Mainland Iberia is never upserted as a Europe destination.
 */
export function isNonMainlandIberiaAirport(
  country: string,
  lat: number,
  lng: number,
): boolean {
  const iso = country.trim().toUpperCase();
  if (iso !== "PT" && iso !== "ES") return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

  // Azores / Madeira (west of mainland Iberia)
  if (lng < -15) return true;
  // Canaries (south-west of mainland; lon roughly −18 to −13)
  if (lat < 30 && lng < -12) return true;
  // Ceuta / Melilla (North Africa)
  if (lat < 36.2 && lng > -6.5 && lng < -1.5) return true;
  // Balearics
  if (lat >= 38.4 && lat <= 40.2 && lng >= 1.0 && lng <= 4.5) return true;

  return false;
}

export function isEuropeIsoCountry(country: string): boolean {
  return EUROPE_ISO_COUNTRIES.has(country.trim().toUpperCase());
}

/**
 * Whether an airport IATA should become (or remain) a Europe destination station.
 */
export function isEuropeDestinationCandidate(
  iata: string,
  coords: AirportCoordinate,
  hubIatas: ReadonlySet<string>,
): boolean {
  const code = iata.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return false;
  if (hubIatas.has(code)) return false;

  const iso = (coords.country ?? "").trim().toUpperCase();
  if (!isEuropeIsoCountry(iso)) return false;

  if (iso === "PT" || iso === "ES") {
    return isNonMainlandIberiaAirport(iso, coords.lat, coords.lng);
  }

  return Number.isFinite(coords.lat) && Number.isFinite(coords.lng);
}

export function destinationAirportDisplayName(iata: string, name: string): string {
  const code = iata.trim().toUpperCase();
  const base = (name || code).replace(/\s*\([A-Z]{3}\)\s*$/, "").trim() || code;
  if (/\([A-Z]{3}\)\s*$/.test(base)) return base;
  return `${base} (${code})`;
}
