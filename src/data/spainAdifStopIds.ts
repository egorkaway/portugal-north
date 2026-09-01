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

  "València-Joaquín Sorolla": ["03216"],

  "Lora del Río": ["50600"],

  "Maçanet-Massanes": ["79200"],

  "Bilbao-Intermod. Abando Indalecio Prieto": ["13200"],

  "Ciempozuelos": ["60105"],

  "Santander": ["14223"],

  "Soto del Henares": ["70112"],

  "Vila-seca": ["71401"],

  "Cambrils": ["65422"],

  "Las Rozas": ["10005"],

  "Leganés": ["35001"],

  "Madrid-Ramón y Cajal": ["97201"],

  "Calatayud": ["70600"],

  "Navalmoral de la Mata": ["35206"],

  "Reinosa": ["14202"],

  "Miranda de Ebro": ["11200"],

  "Fuencarral": ["17001"],

  "San Fernando de Henares": ["70101"],

  "L'Hospitalet de Llobregat": ["72305"],

  "Las Matas": ["10101"],

  "Torrelavega": ["14213"],

  "Madrid-Villaverde Bajo": ["60100"],

  "Pitis": ["97100"],

  "Valdelasfuentes": ["19002"],

  "Barcelona Arc de Triomf": ["78804"],

  "Figueres": ["79309"],

  "Elda-Petrer": ["60905"],

  "La Serna-Fuenlabrada": ["35010"],

  "San Bernardo": ["51100"],

  "Tudela de Navarra": ["81202"],

  "Altafulla-Tamarit": ["71502"],

  "Balsicas-Mar Menor": ["61303"],

  "Granollers Centre": ["79100"],

  "Pirámides": ["18005"],

  "Ametzola": ["13206"],

  "Barcelona Estació de França": ["79400"],

  "València-La Font de Sant Lluís": ["65002"],

  "Guadalajara-Yebes": ["04007"],

  "Sol": ["18101"],

  "Murcia del Carmen": ["61200"],

  "Torrejón de Ardoz": ["70102"],

  "Ujo": ["15200"],

  "Sitges": ["71701"],

  "Utebo": ["70801"],

  "Virgen del Rocío": ["51110"],

  "Barcelona Plaça de Catalunya": ["78805"],

  "El Prat de Llobregat": ["71707"],

  "Caldes de Malavella": ["79203"],

  "San Fernando-Bahía Sur": ["51406"],

  "Pravia": ["05325"],

  "Puerto de Santa María": ["51400"],

  "Briviesca": ["11109"],

  "Reus": ["71400"],

  "Granada": ["05000", "72205"],

  "Monfragüe": ["30000"],

  "Alcalá de Henares": ["70103"],

  "Figueres-Vilafant": ["04307"],

  "Elche/Elx AV": ["03410"],

  "Las Zorreras-Navalquejigo": ["10202"],

  "Pola de Siero": ["05513"],

  "Tortosa": ["65400"],

  "Alcázar de San Juan": ["60400"],

  "Madrid-Villaverde Alto": ["37001"],

  "Parla": ["37012"],

  "Arévalo": ["10409"],

  "Maliaño Vidriera": ["05655"],

  "Las Margaritas": ["37010"],

  "Lieres": ["05517"],

  "Ordizia": ["11405"],

  "Málaga María Zambrano": ["54413"],

  "Bellvitge-Gornal": ["71708"],

  "San Ranón": ["05327"],

  "Legazpi": ["11306"],

  "Mirasierra-Paco de Lucía": ["97200"],

  "Benicarló-Peñíscola": ["65311"],

  "Cantaelgallo": ["51112"],

  "Coslada": ["70108"],

  "Sant Vicenç de Castellet": ["78604"],

  "Cádiz": ["51405"],

  "Nules la Villavella": ["65206"],

  "Venta de Baños": ["11000"],

  "Tremañes Carreño": ["05203"],

  "Xeraco": ["69107"],

  "Lebrija": ["51203"],

  "Cabrera de Mar-Vilassar de Mar": ["79412"],

  "Villena Alta Velocidad": ["03309"],

  "Zumarraga": ["11400"],

  "Martorell Central": ["72209"],

  "Flaçà": ["79303"],

  "Monforte de Lemos": ["20300"],

  "Barcelona Sant Andreu": ["79004"],

  "Antequera-Santa Ana": ["02003"],

  "Castellbisbal": ["72210"],

  "Sant Adrià de Besòs": ["79403"],

  "La Pereda-Riosa": ["15206"],

  "Sils": ["79202"],

  "Vitoria-Gasteiz": ["11208"],

  "Silla": ["64200"],

  "Bembibre": ["20111"],

  "El Pito Piñera": ["05244"],

  "Lorca-San Diego": ["06005"],

  "Noreña": ["05413"],

  "Calahorra": ["81108"],

  "Tolosa": ["11500"],

  "Antequera AV": ["02030"],

  "Ribadeo": ["05193"],

  "Iñarratxu": ["13116"],

  "Pola de Lena": ["15122"],

  "Novelda-Aspe": ["60907"],

  "Cercedilla": ["12006"],

  "Vallobín": ["05300"],

  "Vilassar de Mar": ["79410"],

  "O Barco de Valdeorras": ["20211"],

  "Llançà": ["79312"],

  "San Severiano": ["51414"],

  "Collado Mediano": ["12004"],

  "Guadalajara": ["70200"],

  "Hernani-Erdia": ["11507"],

  "La Quadra": ["05465"],

  "Meco": ["70104"],

  "Las Retamas": ["35610"],

  "L'Hospitalet de l'Infant": ["65420"],

  "Sagunt": ["65200"],

  "Valle Real": ["05652"],

  "Puerto de Navacerrada": ["12020"],

  "Guadix": ["56200"],

  "L'Alcúdia de Crespins": ["64006"],

  "Puente Genil-Herrera": ["02002"],

  "Bell-lloc d'Urgell": ["78402"],

  "Mérida": ["37500"],

  "Plasencia": ["30002"],

  "Pozuelo": ["10002"],

  "Ciaño": ["16010"],

  "Astillero": ["05657"],

  "Massanassa": ["64202"],

  "Universidad-Cantoblanco": ["17009"],

  "L'Ametlla de Mar": ["65405"],

  "Bellavista": ["51111"],

  "Miribilla": ["13120"],

  "Benifaió": ["64107"],

  "Mieres-Puente": ["15203"],

  "Almassora": ["65209"],

  "Guadajoz": ["50602"],

  "València-Cabanyal": ["65003"],

  "Lenova-Manuel": ["64007"],

  "Zarzaquemada": ["35009"],

  "Los Boliches": ["54515"],

  "Peñota": ["13404"],

  "Putxeta": ["13505"],

  "Humanes": ["35012"],

  "Tardienta": ["78200"],

  "Villena": ["60902"],

  "Torrelavega-Centro": ["05621"],

  "Requena-Utiel": ["03213"],

  "Balmaseda": ["05483"],

  "San Jerónimo": ["43000"],

  "Águilas-El Labradorcico": ["07007"],

  "Los Rosales": ["50700"],

  "Benacazón": ["43005"],

  "Gavà": ["71706"],

  "La Rocica": ["16402"],

  "Levinco": ["05387"],

  "Viladecans": ["71709"],

  "Vicálvaro": ["70100"],

  "Almansa": ["60800"],

  "Beasain": ["11404"],

  "Llanes": ["05571"],

  "Méndez Álvaro P.V.": ["18003"],

  "Zaragoza-Miraflores": ["71100"],

  "Algemesí": ["64105"],

  "Herradón-La Cañada": ["10300"],

  "Logroño": ["81100"],

  "Trubia": ["05311"],

  "Badalona": ["79404"],

  "Callosa de Segura": ["62003"],

  "Cádiz-Estadio": ["51409"],

  "Pizarra": ["54406"],

  "Getafe-Centro": ["37002"],

  "Castelldefels": ["71705"],

  "Colloto": ["05505"],

  "Terrassa Est": ["78710"],

  "Estación de tren Hospital": ["05952"],

  "Huercal-Viator": ["56310"],

  "Alcorcón": ["35605"],

  "Torrijos": ["35105"],

  "Catarroja": ["64201"],

  "Calafell": ["71601"],

  "Los Nietos Pescadería": ["05975"],

  "Benicàssim": ["65318"],

  "Montcada i Reixac-Santa Maria": ["78707"],

  "Colmenar Viejo": ["17005"],

  "Aluche": ["35600"],

  "Tavernes de la Valldigna": ["69105"],

  "Villallana": ["15123"],

  "Beniel": ["62001"],

  "Cabezón de la Sal": ["05637"],

  "Ferrol": ["21010"],

  "Molins de Rei": ["72300"],

  "Terrassa Estació del Nord": ["78700"],

  "Andoain-Centro": ["11504"],

  "Viveiro": ["05155"],

  "Ocata": ["79408"],

  "Laguna": ["35608"],

  "Alcalá de Chivert": ["65308"],

  "Aranguren": ["05473", "05474"],

  "Lutxana-Barakaldo": ["13305"],

  "Sant Joan Despí": ["72302"],

  "Maestra Justa Freire-Polidep. Aluche": ["35601"],

  "Ablaña": ["15205"],

  "Manzanares": ["50100"],

  "Las Águilas": ["35602"],

  "Crevillente": ["62101"],

  "Xuvia": ["05107"],

  "Canet de Mar": ["79601"],

  "Montcada i Reixac-Manresa": ["78708"],

  "Puente San Miguel": ["05623"],

  "Sant Feliu de Llobregat": ["72301"],

  "Montmeló": ["79007"],

  "Valls": ["76004"],

  "Oropesa de Toledo": ["35203"],

  "Marçà-Falset": ["71303"],

  "Arenys de Mar": ["79600"],

  "Vilches": ["50207"],

  "Celrà": ["79301"],

  "Colera": ["79314"],

  "Alzira": ["64104"],

  "Candás": ["05210", "05211"],

  "Peñaranda de Bracamonte": ["34010"],

  "El Puig": ["65007"],

  "El Chorro-Caminito del Rey": ["54403"],

  "Chiva": ["66207"],

  "Segunda Aguada": ["51404"],

  "Carcaixent": ["64103"],

  "Torreblanca": ["65306"],

  "Les Borges del Camp": ["71307"],

  "Meres": ["05507"],

  "Ortigueira": ["05139"],

  "Montgat": ["79405"],

  "Robledo de Chavela": ["10205"],

  "Cervera": ["78500"],

  "Orpesa": ["65304"],

  "Zarzalejo": ["10204"],

  "San Sadurniño": ["05115"],

  "Cullera": ["69104"],

  "Móra la Nova": ["71300"],

  "Nueva Montaña apeadero": ["05651", "14231"],

  "Tolosa-Centro": ["11501"],

  "La Cantábrica": ["05658"],

  "La Rinconada": ["50703"],

  "Sueca": ["69103"],

  "Zaramillo": ["05463"],

  "Puerto Real": ["51401"],

  "Brinkola": ["11305"],

  "Gualba": ["79105"],

  "Tàrrega": ["78408"],

  "Narbonne": ["87088"],

  "Capçanes": ["71302"],

  "El Prat Aeroport": ["72400"],

  "Bezana": ["05605"],

  "Desertu-Barakaldo": ["13400"],

  "Caspe": ["71204"],

  "Puente Alcocer": ["35704"],

  "Sant Andreu de Llavaneres": ["79501"],

  "Cudillero": ["05245"],

  "La Pobla Llarga": ["64102"],

  "Majadahonda": ["10007"],

  "Vilajuïga": ["79311"],

  "Villabona de Asturias": ["15301"],

  "Vallada": ["64004"],

  "Mollet-Sant Fost": ["79006"],

  "Victoria Kent": ["54501"],

  "Casetas": ["70800"],

  "Artxube": ["05469"],

  "Elche/Elx-Parc": ["62103"],

  "Aeropuerto de Jerez": ["51205"],

  "Sabadell Centre": ["78704"],

  "Lugo de Llanera": ["15300"],

  "Pinto": ["60103"],

  "Arrigorriaga": ["13111"],

  "El Papiol": ["72211"],

  "Doce de Octubre": ["35702"],

  "Alcalá de Henares-Universidad": ["70107"],

  "Embajadores": ["35609"],

  "Álora": ["54405"],

  "Móstoles-El Soto": ["35607"],

  "Cazalla-Constantina": ["40113"],

  "El Pozo": ["70003"],

  "Nava": ["05523"],

  "Sant Sadurní d'Anoia": ["72207"],

  "Calella": ["79603"],

  "Veriña": ["15400"],

  "Calaf": ["78503"],

  "Ganzo": ["05622"],

  "Carancos": ["05529"],

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
