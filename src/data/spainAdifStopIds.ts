/**
 * Adif / Renfe GTFS-RT stop IDs for catalog Spanish stations.
 * Codes from Adif station pages and es.wikipedia.org station articles.
 * Cercanías sometimes uses a different id than long-distance (e.g. Chamartín).
 */
export const SPAIN_STATION_STOP_IDS: Record<string, readonly string[]> = {
  "Vigo-Guixar": ["22308"],
  "Vigo-Urzáiz": ["08223"],
  Redondela: ["22300"],
  Pontevedra: ["23004"],
  "Vilagarcía de Arousa": ["23008"],
  Padrón: ["23011"],
  "Santiago de Compostela": ["31400"],
  "A Coruña": ["31412"],
  "O Porriño": ["22201"],
  Tui: ["22401"],
  Ourense: ["22100"],
  "A Gudiña-Porta de Galicia": ["08251"],
  "Sanabria Alta Velocidad": ["08247"],
  Zamora: ["30200"],
  "Madrid-Chamartín": ["17000", "98003"],
  "Barcelona-Sants": ["71801"],
  "Barcelona-Passeig de Gràcia": ["71802"],
  "Madrid-Puerta de Atocha": ["60000"],
  Tafalla: ["80108"],
};

export function normalizeSpainStopId(stopId: string): string {
  const digits = stopId.replace(/\D/g, "");
  if (!digits) return stopId.trim();
  return digits.length >= 5 ? digits : digits.padStart(5, "0");
}

const STOP_ID_TO_STATION: Record<string, string> = {};
for (const [station, ids] of Object.entries(SPAIN_STATION_STOP_IDS)) {
  for (const id of ids) {
    STOP_ID_TO_STATION[normalizeSpainStopId(id)] = station;
  }
}

export function catalogStationForSpainStopId(stopId: string | null | undefined): string | null {
  if (!stopId) return null;
  return STOP_ID_TO_STATION[normalizeSpainStopId(stopId)] ?? null;
}

export function primarySpainStopId(stationName: string): string | null {
  const ids = SPAIN_STATION_STOP_IDS[stationName];
  return ids?.[0] ?? null;
}
