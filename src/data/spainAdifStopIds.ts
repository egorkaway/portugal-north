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
  "Castejón de Ebro": ["81200"],

  "Girona": ["79300"],

  "Valladolid-Campo Grande": ["10600"],

  "Sant Vicenç de Calders": ["71600"],

  "Zaragoza Delicias": ["04040"],

  "Córdoba-Julio Anguita": ["50500"],

  "Sevilla-Santa Justa": ["51003"],

  "Orihuela-Miguel Hernández": ["62002"],

  "Alhama de Murcia": ["06002"],

  "León": ["15100"],

  "Madrid-Príncipe Pío": ["10000"],

  "Madrid-Recoletos": ["18001"],

  "Camp de Tarragona": ["04104"],

  "Valdecilla la Marga": ["05602"],

  "València-Estació del Nord": ["65000"],

  "Burgos-Rosa Manzano": ["11014"],

  "Madrid-Nuevos Ministerios": ["18002"],

  "Fuenlabrada": ["35002"],

  "Aravaca": ["10001"],

  "Oviedo": ["15211"],

  "Cáceres": ["35400"],

  "Calzada de Asturias": ["15401"],

  "Asamblea de Madrid-Entrevías": ["70002"],

  "Castelló de la Plana": ["65300"],

  "Zaragoza-Portillo": ["70806"],

  "Segovia-Guiomar": ["08004"],

  "Barcelona El Clot": ["79009"],

  "Getafe-Sector 3": ["37011"],

  "La Garena": ["70111"],

  "Sant Celoni": ["79104"],

  "Móstoles": ["35606"],

  "Aranjuez": ["60200"],

  "Vilanova i la Geltrú": ["71700"],

  "Alfafar-Benetússer": ["64203"],

  "Cuenca-Fernando Zóbel": ["03208"],

  "Jerez de la Frontera": ["51300"],

  "Lleida-Pirineus": ["78400"],

  "Alicante/Alacant-Terminal": ["60911"],

  "El Escorial": ["10203"],

  "Palencia": ["14100"],

  "Sant Gabriel": ["62109"],

  "Villalba de Guadarrama": ["10200"],

  "Fuente de la Mora": ["98003"],

  "Sant Vicent Centre": ["60913"],

  "Albacete-Los Llanos": ["60600"],

  "Infiesto": ["05533", "05534"],

  "Parque Principado": ["05504"],

  "Torredembarra": ["71503"],

  "Galapagar-La Navata": ["10104"],

  "Elche/Elx-Carrús": ["62102"],

  "La Corredoria": ["15217"],

  "Medina del Campo": ["10500"],

  "Ávila": ["10400"],

  "Dos Hermanas": ["51103"],

  "Llodio": ["13106"],

  "El Berrón": ["05509"],

  "Llamaquique": ["15218"],

  "Tarragona": ["71500"],

  "Valdebebas": ["98304"],

  "San Isidro-Albatera-Catral": ["62100"],

  "Universidad de Alicante": ["60914"],

  "Cartagena": ["61307"],

  "Pinar de las Rozas": ["10100"],

  "Los Molinos-Guadarrama": ["12005"],

  "Salamanca": ["30100"],

  "Azuqueca": ["70105"],

  "Talavera de la Reina": ["35200"],

  "Manresa": ["78600"],

  "Tres Cantos": ["17004"],

  "Gijón-Sanz Crespo": ["15410"],

  "L'Aldea-Amposta-Tortosa": ["65402"],

  "Ormáiztegui": ["11402"],

  "Zabalburu": ["13205"],

  "Avilés-Apeadero": ["05221", "16403"],

  "Ciudad Real": ["37200"],

  "Pamplona/Iruña": ["80100"],

  "San Sebastián-Donostia": ["11511"],

  "Zaragoza-Goya": ["70807"],

  "Xàtiva": ["64100"],

  "Torrelodones": ["10103"],

  "Utrera": ["51200"],

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
