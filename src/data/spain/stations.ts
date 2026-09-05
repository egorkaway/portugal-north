import type { Station } from "../stationTypes";

/**
 * Spanish stations: active Renfe services from Vigo plus historic stops with surviving buildings.
 * Sources: Adif live boards (vigo-guixar, vigo-urzaiz), Renfe Eje Atlántico press releases,
 * seat61.com Vigo station guide, egtre.info Galicia sparse services, es.wikipedia.org (Tui).
 */
export const spainStations: Station[] = [
  {
    name: "Vigo-Guixar",
    country: "es",
    lines: ["Eje Atlántico", "Celta (Porto–Vigo)"],
    types: ["Regional", "Internacional"],
    lat: 42.2395,
    lng: -8.7119,
  },
  {
    name: "Vigo-Urzáiz",
    country: "es",
    lines: ["Eje Atlántico", "Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Intercidades", "Regional"],
    lat: 42.2339,
    lng: -8.7125,
  },
  {
    name: "Redondela",
    country: "es",
    lines: ["Eje Atlántico", "Celta (Porto–Vigo)"],
    types: ["Regional"],
    lat: 42.288,
    lng: -8.6096,
  },
  {
    name: "Pontevedra",
    country: "es",
    lines: ["Eje Atlántico", "Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Regional", "Intercidades"],
    lat: 42.4242,
    lng: -8.6447,
  },
  {
    name: "Vilagarcía de Arousa",
    country: "es",
    lines: ["Eje Atlántico", "Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Regional", "Intercidades"],
    lat: 42.5967,
    lng: -8.7642,
  },
  {
    name: "Padrón",
    country: "es",
    lines: ["Eje Atlántico"],
    types: ["Regional"],
    lat: 42.7389,
    lng: -8.6608,
  },
  {
    name: "Santiago de Compostela",
    country: "es",
    lines: ["Eje Atlántico", "Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Regional", "Intercidades"],
    lat: 42.9063,
    lng: -8.5289,
  },
  {
    name: "A Coruña",
    country: "es",
    lines: ["Eje Atlántico", "Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Regional", "Intercidades"],
    lat: 43.3533,
    lng: -8.4022,
  },
  {
    name: "O Porriño",
    country: "es",
    lines: ["Eje Atlántico", "Minho (fronteira)", "Celta (Porto–Vigo)"],
    types: ["Regional"],
    lat: 42.1619,
    lng: -8.6197,
  },
  {
    name: "Tui",
    country: "es",
    lines: ["Ramal internacional Guillarey–Valença (historic)", "Celta (Porto–Vigo)"],
    types: ["Inactive / Historic"],
    lat: 42.0565,
    lng: -8.643,
  },
  {
    name: "Ourense",
    country: "es",
    lines: ["Eje Atlántico", "Línea Ourense–León", "Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Regional", "Intercidades"],
    lat: 42.3502,
    lng: -7.8711,
  },
  {
    name: "A Gudiña-Porta de Galicia",
    country: "es",
    lines: ["Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Intercidades"],
    lat: 42.0638,
    lng: -7.1344,
  },
  {
    name: "Sanabria Alta Velocidad",
    country: "es",
    lines: ["Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Intercidades"],
    lat: 42.0448,
    lng: -6.5629,
  },
  {
    name: "Zamora",
    country: "es",
    lines: ["Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Intercidades"],
    lat: 41.5159,
    lng: -5.7397,
  },
  {
    name: "Madrid-Chamartín",
    country: "es",
    lines: ["Línea de alta velocidad (Madrid–Galicia)", "Línea de alta velocidad (Madrid–Valladolid–Norte)"],
    types: ["Intercidades"],
    lat: 40.472,
    lng: -3.6823,
  },
  {
    name: "Barcelona-Sants",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)", "Corredor Mediterráneo"],
    types: ["Intercidades"],
    lat: 41.3794,
    lng: 2.1403,
  },
  {
    name: "Barcelona-Passeig de Gràcia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.3921,
    lng: 2.1653,
  },
  {
    name: "Madrid-Puerta de Atocha",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)", "Línea de alta velocidad (Madrid–Levante)", "Línea de alta velocidad (Madrid–Sevilla)", "Línea Madrid–Extremadura", "Línea Madrid–Valencia (vía Alcázar)"],
    types: ["Intercidades"],
    lat: 40.4064,
    lng: -3.6909,
  },
  {
    name: "Tafalla",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Zaragoza–Pamplona"],
    types: ["Urban", "Intercidades"],
    lat: 42.5258,
    lng: -1.6715,
  },
  {
    name: "Castejón de Ebro",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Zaragoza–Pamplona"],
    types: ["Urban", "Intercidades"],
    lat: 42.1727,
    lng: -1.6921,
  },

  {
    name: "Girona",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)"],
    types: ["Urban", "Intercidades"],
    lat: 41.9794,
    lng: 2.8169,
  },

  {
    name: "Valladolid-Campo Grande",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Valladolid–Norte)"],
    types: ["Urban", "Intercidades"],
    lat: 41.6422,
    lng: -4.727,
  },

  {
    name: "Sant Vicenç de Calders",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 41.1862,
    lng: 1.5248,
  },

  {
    name: "Zaragoza Delicias",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)", "Línea Zaragoza–Pamplona"],
    types: ["Urban", "Intercidades"],
    lat: 41.6587,
    lng: -0.9113,
  },

  {
    name: "Córdoba-Julio Anguita",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Sevilla)"],
    types: ["Intercidades"],
    lat: 37.8883,
    lng: -4.7895,
  },

  {
    name: "Sevilla-Santa Justa",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Sevilla)", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 37.3925,
    lng: -5.9749,
  },

  {
    name: "Orihuela-Miguel Hernández",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Levante)", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 38.0779,
    lng: -0.9446,
  },

  {
    name: "Alhama de Murcia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.8494,
    lng: -1.4145,
  },

  {
    name: "León",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Valladolid–Norte)", "Línea Ourense–León"],
    types: ["Urban", "Intercidades"],
    lat: 42.596,
    lng: -5.5824,
  },

  {
    name: "Madrid-Príncipe Pío",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4215,
    lng: -3.719,
  },

  {
    name: "Madrid-Recoletos",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4234,
    lng: -3.6909,
  },

  {
    name: "Camp de Tarragona",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)"],
    types: ["Intercidades"],
    lat: 41.1921,
    lng: 1.2727,
  },

  {
    name: "Valdecilla la Marga",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Santander–Reinosa"],
    types: ["Urban", "Intercidades"],
    lat: 43.4529,
    lng: -3.8282,
  },

  {
    name: "València-Estació del Nord",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo", "Línea Madrid–Valencia (vía Alcázar)"],
    types: ["Urban", "Intercidades"],
    lat: 39.4669,
    lng: -0.3772,
  },

  {
    name: "Burgos-Rosa Manzano",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Valladolid–Norte)"],
    types: ["Urban", "Intercidades"],
    lat: 42.3712,
    lng: -3.6663,
  },

  {
    name: "Madrid-Nuevos Ministerios",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4466,
    lng: -3.6923,
  },

  {
    name: "Fuenlabrada",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.2834,
    lng: -3.7994,
  },

  {
    name: "Aravaca",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4485,
    lng: -3.7856,
  },

  {
    name: "Oviedo",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.3664,
    lng: -5.8548,
  },

  {
    name: "Cáceres",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Madrid–Extremadura"],
    types: ["Urban", "Intercidades"],
    lat: 39.4611,
    lng: -6.3857,
  },

  {
    name: "Calzada de Asturias",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.5354,
    lng: -5.6972,
  },

  {
    name: "Asamblea de Madrid-Entrevías",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.3819,
    lng: -3.668,
  },

  {
    name: "Castelló de la Plana",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 39.9885,
    lng: -0.0523,
  },

  {
    name: "Zaragoza-Portillo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6527,
    lng: -0.8959,
  },

  {
    name: "Segovia-Guiomar",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Valladolid–Norte)"],
    types: ["Intercidades"],
    lat: 40.9106,
    lng: -4.0946,
  },

  {
    name: "Barcelona El Clot",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.4093,
    lng: 2.1872,
  },

  {
    name: "Getafe-Sector 3",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.2884,
    lng: -3.7375,
  },

  {
    name: "La Garena",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4805,
    lng: -3.393,
  },

  {
    name: "Sant Celoni",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6858,
    lng: 2.4907,
  },

  {
    name: "Móstoles",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3287,
    lng: -3.8636,
  },

  {
    name: "Aranjuez",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Madrid–Valencia (vía Alcázar)"],
    types: ["Urban", "Intercidades"],
    lat: 40.035,
    lng: -3.6183,
  },

  {
    name: "Vilanova i la Geltrú",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 41.2203,
    lng: 1.7308,
  },

  {
    name: "Alfafar-Benetússer",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.4224,
    lng: -0.3926,
  },

  {
    name: "Cuenca-Fernando Zóbel",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Levante)"],
    types: ["Intercidades"],
    lat: 40.0352,
    lng: -2.1444,
  },

  {
    name: "Jerez de la Frontera",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 36.68,
    lng: -6.1266,
  },

  {
    name: "Lleida-Pirineus",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)"],
    types: ["Urban", "Intercidades"],
    lat: 41.6201,
    lng: 0.6337,
  },

  {
    name: "Alicante/Alacant-Terminal",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Levante)", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 38.3447,
    lng: -0.4955,
  },

  {
    name: "El Escorial",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5854,
    lng: -4.1324,
  },

  {
    name: "Palencia",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Valladolid–Norte)"],
    types: ["Urban", "Intercidades"],
    lat: 42.0157,
    lng: -4.5341,
  },

  {
    name: "Sant Gabriel",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.3291,
    lng: -0.5087,
  },

  {
    name: "Villalba de Guadarrama",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.6265,
    lng: -4.008,
  },

  {
    name: "Fuente de la Mora",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4847,
    lng: -3.6631,
  },

  {
    name: "Sant Vicent Centre",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.3947,
    lng: -0.5287,
  },

  {
    name: "Albacete-Los Llanos",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Levante)", "Línea Madrid–Valencia (vía Alcázar)"],
    types: ["Intercidades"],
    lat: 38.9994,
    lng: -1.8484,
  },

  {
    name: "Infiesto",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3518,
    lng: -5.3692,
  },

  {
    name: "Parque Principado",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.3866,
    lng: -5.8088,
  },

  {
    name: "Torredembarra",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 41.1428,
    lng: 1.4058,
  },

  {
    name: "Galapagar-La Navata",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.6003,
    lng: -3.9823,
  },

  {
    name: "Elche/Elx-Carrús",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 38.269,
    lng: -0.7064,
  },

  {
    name: "La Corredoria",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.3881,
    lng: -5.8273,
  },

  {
    name: "Medina del Campo",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Valladolid–Norte)"],
    types: ["Urban", "Intercidades"],
    lat: 41.3176,
    lng: -4.9099,
  },

  {
    name: "Ávila",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.6573,
    lng: -4.6833,
  },

  {
    name: "Dos Hermanas",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 37.2872,
    lng: -5.9235,
  },

  {
    name: "Llodio",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban", "Intercidades"],
    lat: 43.1424,
    lng: -2.9607,
  },

  {
    name: "El Berrón",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.3827,
    lng: -5.7027,
  },

  {
    name: "Llamaquique",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.3588,
    lng: -5.8573,
  },

  {
    name: "Tarragona",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 41.1116,
    lng: 1.2532,
  },

  {
    name: "Valdebebas",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4821,
    lng: -3.6163,
  },

  {
    name: "San Isidro-Albatera-Catral",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.167,
    lng: -0.8381,
  },

  {
    name: "Universidad de Alicante",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.3842,
    lng: -0.5284,
  },

  {
    name: "Cartagena",
    country: "es",
    lines: ["Larga distancia", "Corredor Mediterráneo"],
    types: ["Intercidades"],
    lat: 37.605,
    lng: -0.9751,
  },

  {
    name: "Pinar de las Rozas",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5223,
    lng: -3.8822,
  },

  {
    name: "Los Molinos-Guadarrama",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.7066,
    lng: -4.0672,
  },

  {
    name: "Salamanca",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 40.9722,
    lng: -5.649,
  },

  {
    name: "Azuqueca",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5611,
    lng: -3.2654,
  },

  {
    name: "Talavera de la Reina",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Madrid–Extremadura"],
    types: ["Urban", "Intercidades"],
    lat: 39.9707,
    lng: -4.8265,
  },

  {
    name: "Manresa",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.7204,
    lng: 1.8265,
  },

  {
    name: "Tres Cantos",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.5987,
    lng: -3.7156,
  },

  {
    name: "Gijón-Sanz Crespo",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.5377,
    lng: -5.6758,
  },

  {
    name: "L'Aldea-Amposta-Tortosa",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 40.7536,
    lng: 0.6143,
  },

  {
    name: "Ormáiztegui",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban", "Intercidades"],
    lat: 43.0403,
    lng: -2.2565,
  },

  {
    name: "Zabalburu",
    country: "es",
    lines: ["Cercanías", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban"],
    lat: 43.2568,
    lng: -2.9323,
  },

  {
    name: "Avilés-Apeadero",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.5546,
    lng: -5.9174,
  },

  {
    name: "Ciudad Real",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Sevilla)"],
    types: ["Intercidades"],
    lat: 38.9853,
    lng: -3.9136,
  },

  {
    name: "Pamplona/Iruña",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Zaragoza–Pamplona"],
    types: ["Urban", "Intercidades"],
    lat: 42.8249,
    lng: -1.6614,
  },

  {
    name: "San Sebastián-Donostia",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban", "Intercidades"],
    lat: 43.3177,
    lng: -1.9767,
  },

  {
    name: "Zaragoza-Goya",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6439,
    lng: -0.8913,
  },

  {
    name: "Xàtiva",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo", "Línea Madrid–Valencia (vía Alcázar)"],
    types: ["Urban", "Intercidades"],
    lat: 38.9921,
    lng: -0.5245,
  },

  {
    name: "Torrelodones",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5746,
    lng: -3.9566,
  },

  {
    name: "Utrera",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 37.1848,
    lng: -5.7908,
  },

  {
    name: "València-Joaquín Sorolla",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Levante)", "Corredor Mediterráneo"],
    types: ["Intercidades"],
    lat: 39.4591,
    lng: -0.3829,
  },

  {
    name: "Lora del Río",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.6613,
    lng: -5.5296,
  },

  {
    name: "Maçanet-Massanes",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.7724,
    lng: 2.6739,
  },

  {
    name: "Bilbao-Intermod. Abando Indalecio Prieto",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban", "Intercidades"],
    lat: 43.2601,
    lng: -2.9286,
  },

  {
    name: "Ciempozuelos",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.1592,
    lng: -3.6102,
  },

  {
    name: "Santander",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Santander–Reinosa"],
    types: ["Urban", "Intercidades"],
    lat: 43.4584,
    lng: -3.811,
  },

  {
    name: "Soto del Henares",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.464,
    lng: -3.4414,
  },

  {
    name: "Vila-seca",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.1128,
    lng: 1.1504,
  },

  {
    name: "Cambrils",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 41.0816,
    lng: 1.046,
  },

  {
    name: "Las Rozas",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4943,
    lng: -3.8682,
  },

  {
    name: "Leganés",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.3286,
    lng: -3.7713,
  },

  {
    name: "Madrid-Ramón y Cajal",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4881,
    lng: -3.6948,
  },

  {
    name: "Calatayud",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)"],
    types: ["Urban", "Intercidades"],
    lat: 41.3467,
    lng: -1.6387,
  },

  {
    name: "Navalmoral de la Mata",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Madrid–Extremadura"],
    types: ["Urban", "Intercidades"],
    lat: 39.8949,
    lng: -5.5456,
  },

  {
    name: "Reinosa",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Santander–Reinosa"],
    types: ["Urban", "Intercidades"],
    lat: 42.9945,
    lng: -4.1409,
  },

  {
    name: "Miranda de Ebro",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.691,
    lng: -2.9404,
  },

  {
    name: "Fuencarral",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.5016,
    lng: -3.6825,
  },

  {
    name: "San Fernando de Henares",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4428,
    lng: -3.534,
  },

  {
    name: "L'Hospitalet de Llobregat",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3642,
    lng: 2.1009,
  },

  {
    name: "Las Matas",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5524,
    lng: -3.8968,
  },

  {
    name: "Torrelavega",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Santander–Reinosa"],
    types: ["Urban", "Intercidades"],
    lat: 43.3277,
    lng: -4.0427,
  },

  {
    name: "Madrid-Villaverde Bajo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3527,
    lng: -3.6839,
  },

  {
    name: "Pitis",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4954,
    lng: -3.7262,
  },

  {
    name: "Valdelasfuentes",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.5474,
    lng: -3.6543,
  },

  {
    name: "Barcelona Arc de Triomf",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3919,
    lng: 2.1806,
  },

  {
    name: "Figueres",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.2651,
    lng: 2.9688,
  },

  {
    name: "Elda-Petrer",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 38.4849,
    lng: -0.8011,
  },

  {
    name: "La Serna-Fuenlabrada",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.2968,
    lng: -3.7926,
  },

  {
    name: "San Bernardo",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 37.3778,
    lng: -5.9796,
  },

  {
    name: "Tudela de Navarra",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Zaragoza–Pamplona"],
    types: ["Urban", "Intercidades"],
    lat: 42.0594,
    lng: -1.5979,
  },

  {
    name: "Altafulla-Tamarit",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 41.1366,
    lng: 1.3734,
  },

  {
    name: "Balsicas-Mar Menor",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 37.8188,
    lng: -0.9509,
  },

  {
    name: "Granollers Centre",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.5997,
    lng: 2.2913,
  },

  {
    name: "Pirámides",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4025,
    lng: -3.7114,
  },

  {
    name: "Ametzola",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban", "Intercidades"],
    lat: 43.2547,
    lng: -2.9437,
  },

  {
    name: "Barcelona Estació de França",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.3845,
    lng: 2.1853,
  },

  {
    name: "València-La Font de Sant Lluís",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.4416,
    lng: -0.3714,
  },

  {
    name: "Guadalajara-Yebes",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)"],
    types: ["Intercidades"],
    lat: 40.5873,
    lng: -3.1243,
  },

  {
    name: "Sol",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4169,
    lng: -3.7029,
  },

  {
    name: "Murcia del Carmen",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea de alta velocidad (Madrid–Levante)", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 37.9748,
    lng: -1.1315,
  },

  {
    name: "Torrejón de Ardoz",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4548,
    lng: -3.4797,
  },

  {
    name: "Ujo",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.2047,
    lng: -5.7926,
  },

  {
    name: "Sitges",
    country: "es",
    lines: ["Cercanías", "Corredor Mediterráneo"],
    types: ["Urban"],
    lat: 41.2391,
    lng: 1.8097,
  },

  {
    name: "Utebo",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Zaragoza–Pamplona"],
    types: ["Urban", "Intercidades"],
    lat: 41.7109,
    lng: -0.9986,
  },

  {
    name: "Virgen del Rocío",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 37.3628,
    lng: -5.976,
  },

  {
    name: "Barcelona Plaça de Catalunya",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3879,
    lng: 2.1697,
  },

  {
    name: "El Prat de Llobregat",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3309,
    lng: 2.0893,
  },

  {
    name: "Caldes de Malavella",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.8411,
    lng: 2.8008,
  },

  {
    name: "San Fernando-Bahía Sur",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 36.4681,
    lng: -6.2068,
  },

  {
    name: "Pravia",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.4909,
    lng: -6.1105,
  },

  {
    name: "Puerto de Santa María",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Sevilla–Cádiz"],
    types: ["Urban", "Intercidades"],
    lat: 36.6041,
    lng: -6.2179,
  },

  {
    name: "Briviesca",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.5428,
    lng: -3.3193,
  },

  {
    name: "Reus",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.1605,
    lng: 1.1001,
  },

  {
    name: "Granada",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.184,
    lng: -3.6092,
  },

  {
    name: "Monfragüe",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Madrid–Extremadura"],
    types: ["Urban", "Intercidades"],
    lat: 39.9375,
    lng: -6.1009,
  },

  {
    name: "Alcalá de Henares",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4891,
    lng: -3.3662,
  },

  {
    name: "Figueres-Vilafant",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Barcelona–Francia)"],
    types: ["Intercidades"],
    lat: 42.2648,
    lng: 2.9435,
  },

  {
    name: "Elche/Elx AV",
    country: "es",
    lines: ["Larga distancia", "Línea de alta velocidad (Madrid–Levante)"],
    types: ["Intercidades"],
    lat: 38.2455,
    lng: -0.7667,
  },

  {
    name: "Las Zorreras-Navalquejigo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.6093,
    lng: -4.0464,
  },

  {
    name: "Pola de Siero",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Oviedo–Gijón"],
    types: ["Urban", "Intercidades"],
    lat: 43.3882,
    lng: -5.6648,
  },

  {
    name: "Tortosa",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Corredor Mediterráneo"],
    types: ["Urban", "Intercidades"],
    lat: 40.8073,
    lng: 0.523,
  },

  {
    name: "Alcázar de San Juan",
    country: "es",
    lines: ["Larga distancia", "Línea Madrid–Valencia (vía Alcázar)"],
    types: ["Intercidades"],
    lat: 39.3956,
    lng: -3.2057,
  },

  {
    name: "Madrid-Villaverde Alto",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3416,
    lng: -3.7124,
  },

  {
    name: "Parla",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.2411,
    lng: -3.7693,
  },

  {
    name: "Arévalo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.0471,
    lng: -4.702,
  },

  {
    name: "Maliaño Vidriera",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Línea Santander–Reinosa"],
    types: ["Urban", "Intercidades"],
    lat: 43.416,
    lng: -3.8411,
  },

  {
    name: "Las Margaritas",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3231,
    lng: -3.7273,
  },

  {
    name: "Lieres",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3806,
    lng: -5.5826,
  },

  {
    name: "Ordizia",
    country: "es",
    lines: ["Cercanías", "Larga distancia", "Eje Cantábrico (Bilbao–San Sebastián)"],
    types: ["Urban", "Intercidades"],
    lat: 43.0528,
    lng: -2.1792,
  },

  {
    name: "Málaga María Zambrano",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 36.7113,
    lng: -4.4314,
  },

  {
    name: "Bellvitge-Gornal",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3549,
    lng: 2.1153,
  },

  {
    name: "San Ranón",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.5165,
    lng: -6.082,
  },

  {
    name: "Legazpi",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.051,
    lng: -2.3306,
  },

  {
    name: "Mirasierra-Paco de Lucía",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4998,
    lng: -3.7093,
  },

  {
    name: "Benicarló-Peñíscola",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4276,
    lng: 0.4152,
  },

  {
    name: "Cantaelgallo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.2782,
    lng: -5.9104,
  },

  {
    name: "Coslada",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4232,
    lng: -3.5611,
  },

  {
    name: "Sant Vicenç de Castellet",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6688,
    lng: 1.8626,
  },

  {
    name: "Cádiz",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.5289,
    lng: -6.288,
  },

  {
    name: "Nules la Villavella",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.8532,
    lng: -0.1527,
  },

  {
    name: "Venta de Baños",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.9174,
    lng: -4.4958,
  },

  {
    name: "Tremañes Carreño",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.5286,
    lng: -5.6949,
  },

  {
    name: "Xeraco",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 39.0261,
    lng: -0.215,
  },

  {
    name: "Lebrija",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.9116,
    lng: -6.0948,
  },

  {
    name: "Cabrera de Mar-Vilassar de Mar",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5068,
    lng: 2.4016,
  },

  {
    name: "Villena Alta Velocidad",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 38.5853,
    lng: -0.8733,
  },

  {
    name: "Zumarraga",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.0871,
    lng: -2.3202,
  },

  {
    name: "Martorell Central",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4793,
    lng: 1.9253,
  },

  {
    name: "Flaçà",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.0475,
    lng: 2.9574,
  },

  {
    name: "Monforte de Lemos",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.5297,
    lng: -7.5036,
  },

  {
    name: "Barcelona Sant Andreu",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.4361,
    lng: 2.1932,
  },

  {
    name: "Antequera-Santa Ana",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 37.0699,
    lng: -4.719,
  },

  {
    name: "Castellbisbal",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4734,
    lng: 1.9676,
  },

  {
    name: "Sant Adrià de Besòs",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4244,
    lng: 2.2305,
  },

  {
    name: "La Pereda-Riosa",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2771,
    lng: -5.8122,
  },

  {
    name: "Sils",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.8076,
    lng: 2.745,
  },

  {
    name: "Vitoria-Gasteiz",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.8415,
    lng: -2.6726,
  },

  {
    name: "Silla",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.362,
    lng: -0.415,
  },

  {
    name: "Bembibre",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.6096,
    lng: -6.422,
  },

  {
    name: "El Pito Piñera",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.5469,
    lng: -6.1433,
  },

  {
    name: "Lorca-San Diego",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.6807,
    lng: -1.6856,
  },

  {
    name: "Noreña",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.394,
    lng: -5.7036,
  },

  {
    name: "Calahorra",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.3105,
    lng: -1.9578,
  },

  {
    name: "Tolosa",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.1354,
    lng: -2.0791,
  },

  {
    name: "Antequera AV",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 37.0334,
    lng: -4.5613,
  },

  {
    name: "Ribadeo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.5361,
    lng: -7.0556,
  },

  {
    name: "Iñarratxu",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.0358,
    lng: -3.0039,
  },

  {
    name: "Pola de Lena",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.1587,
    lng: -5.831,
  },

  {
    name: "Novelda-Aspe",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.4071,
    lng: -0.7777,
  },

  {
    name: "Cercedilla",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.7376,
    lng: -4.0663,
  },

  {
    name: "Vallobín",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3652,
    lng: -5.8648,
  },

  {
    name: "Vilassar de Mar",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5006,
    lng: 2.3899,
  },

  {
    name: "O Barco de Valdeorras",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.4183,
    lng: -6.985,
  },

  {
    name: "Llançà",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.3666,
    lng: 3.149,
  },

  {
    name: "San Severiano",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 36.5216,
    lng: -6.2807,
  },

  {
    name: "Collado Mediano",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.6929,
    lng: -4.0359,
  },

  {
    name: "Guadalajara",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.6442,
    lng: -3.1823,
  },

  {
    name: "Hernani-Erdia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.2665,
    lng: -1.9726,
  },

  {
    name: "La Quadra",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.2227,
    lng: -3.025,
  },

  {
    name: "Meco",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5347,
    lng: -3.2987,
  },

  {
    name: "Las Retamas",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3421,
    lng: -3.8425,
  },

  {
    name: "L'Hospitalet de l'Infant",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.9994,
    lng: 0.9125,
  },

  {
    name: "Sagunt",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.6758,
    lng: -0.2715,
  },

  {
    name: "Valle Real",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.4275,
    lng: -3.8405,
  },

  {
    name: "Puerto de Navacerrada",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.7845,
    lng: -4.0048,
  },

  {
    name: "Guadix",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 37.3169,
    lng: -3.1272,
  },

  {
    name: "L'Alcúdia de Crespins",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 38.9691,
    lng: -0.5867,
  },

  {
    name: "Puente Genil-Herrera",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 37.3579,
    lng: -4.8216,
  },

  {
    name: "Bell-lloc d'Urgell",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6316,
    lng: 0.7815,
  },

  {
    name: "Mérida",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.9215,
    lng: -6.3438,
  },

  {
    name: "Plasencia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.0223,
    lng: -6.0994,
  },

  {
    name: "Pozuelo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4475,
    lng: -3.8003,
  },

  {
    name: "Ciaño",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2894,
    lng: -5.6687,
  },

  {
    name: "Astillero",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.4037,
    lng: -3.8207,
  },

  {
    name: "Massanassa",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.4092,
    lng: -0.3953,
  },

  {
    name: "Universidad-Cantoblanco",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.5438,
    lng: -3.7002,
  },

  {
    name: "L'Ametlla de Mar",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.8862,
    lng: 0.8005,
  },

  {
    name: "Bellavista",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.3215,
    lng: -5.9642,
  },

  {
    name: "Miribilla",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2504,
    lng: -2.9305,
  },

  {
    name: "Benifaió",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.2843,
    lng: -0.43,
  },

  {
    name: "Mieres-Puente",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.25,
    lng: -5.7823,
  },

  {
    name: "Almassora",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.9549,
    lng: -0.0768,
  },

  {
    name: "Guadajoz",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.5815,
    lng: -5.67,
  },

  {
    name: "València-Cabanyal",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.4702,
    lng: -0.3347,
  },

  {
    name: "Lenova-Manuel",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.0501,
    lng: -0.4776,
  },

  {
    name: "Zarzaquemada",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3409,
    lng: -3.7483,
  },

  {
    name: "Los Boliches",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 36.5547,
    lng: -4.6146,
  },

  {
    name: "Peñota",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3264,
    lng: -3.0235,
  },

  {
    name: "Putxeta",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3157,
    lng: -3.0911,
  },

  {
    name: "Humanes",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.2558,
    lng: -3.8287,
  },

  {
    name: "Tardienta",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.9757,
    lng: -0.5382,
  },

  {
    name: "Villena",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.6317,
    lng: -0.8677,
  },

  {
    name: "Torrelavega-Centro",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.351,
    lng: -4.0512,
  },

  {
    name: "Requena-Utiel",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 39.5198,
    lng: -1.1276,
  },

  {
    name: "Balmaseda",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.1964,
    lng: -3.19,
  },

  {
    name: "San Jerónimo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.4332,
    lng: -5.9804,
  },

  {
    name: "Águilas-El Labradorcico",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.412,
    lng: -1.5859,
  },

  {
    name: "Los Rosales",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.59,
    lng: -5.7261,
  },

  {
    name: "Benacazón",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.3569,
    lng: -6.2082,
  },

  {
    name: "Gavà",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3035,
    lng: 2.0105,
  },

  {
    name: "La Rocica",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.5471,
    lng: -5.9047,
  },

  {
    name: "Levinco",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.1511,
    lng: -5.6003,
  },

  {
    name: "Viladecans",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3095,
    lng: 2.0274,
  },

  {
    name: "Vicálvaro",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.4013,
    lng: -3.5959,
  },

  {
    name: "Almansa",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 38.8678,
    lng: -1.1054,
  },

  {
    name: "Beasain",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.0463,
    lng: -2.2023,
  },

  {
    name: "Llanes",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.4209,
    lng: -4.7587,
  },

  {
    name: "Méndez Álvaro P.V.",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3958,
    lng: -3.6778,
  },

  {
    name: "Zaragoza-Miraflores",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6334,
    lng: -0.8682,
  },

  {
    name: "Algemesí",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.1931,
    lng: -0.4409,
  },

  {
    name: "Herradón-La Cañada",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5993,
    lng: -4.495,
  },

  {
    name: "Logroño",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.4575,
    lng: -2.4422,
  },

  {
    name: "Trubia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3486,
    lng: -5.9678,
  },

  {
    name: "Badalona",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4459,
    lng: 2.2489,
  },

  {
    name: "Callosa de Segura",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.1228,
    lng: -0.8746,
  },

  {
    name: "Cádiz-Estadio",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.5029,
    lng: -6.2721,
  },

  {
    name: "Pizarra",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.7642,
    lng: -4.7118,
  },

  {
    name: "Getafe-Centro",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.31,
    lng: -3.734,
  },

  {
    name: "Castelldefels",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.279,
    lng: 1.9792,
  },

  {
    name: "Colloto",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3795,
    lng: -5.7924,
  },

  {
    name: "Terrassa Est",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5675,
    lng: 2.0396,
  },

  {
    name: "Estación de tren Hospital",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.6052,
    lng: -0.9607,
  },

  {
    name: "Huercal-Viator",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 36.8852,
    lng: -2.4367,
  },

  {
    name: "Alcorcón",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3502,
    lng: -3.8317,
  },

  {
    name: "Torrijos",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.979,
    lng: -4.283,
  },

  {
    name: "Catarroja",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.4,
    lng: -0.3992,
  },

  {
    name: "Calafell",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.1897,
    lng: 1.575,
  },

  {
    name: "Los Nietos Pescadería",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.6494,
    lng: -0.7879,
  },

  {
    name: "Benicàssim",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.0579,
    lng: 0.0578,
  },

  {
    name: "Montcada i Reixac-Santa Maria",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4811,
    lng: 2.167,
  },

  {
    name: "Colmenar Viejo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.6452,
    lng: -3.7766,
  },

  {
    name: "Aluche",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3857,
    lng: -3.7607,
  },

  {
    name: "Tavernes de la Valldigna",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 39.079,
    lng: -0.2263,
  },

  {
    name: "Villallana",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.1839,
    lng: -5.8146,
  },

  {
    name: "Beniel",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.0449,
    lng: -0.9995,
  },

  {
    name: "Cabezón de la Sal",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3079,
    lng: -4.2319,
  },

  {
    name: "Ferrol",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.488,
    lng: -8.2311,
  },

  {
    name: "Molins de Rei",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4099,
    lng: 2.0208,
  },

  {
    name: "Terrassa Estació del Nord",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.5698,
    lng: 2.0144,
  },

  {
    name: "Andoain-Centro",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.2156,
    lng: -2.0205,
  },

  {
    name: "Viveiro",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.6569,
    lng: -7.6003,
  },

  {
    name: "Ocata",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.479,
    lng: 2.3195,
  },

  {
    name: "Laguna",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3991,
    lng: -3.7442,
  },

  {
    name: "Alcalá de Chivert",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.3047,
    lng: 0.2287,
  },

  {
    name: "Aranguren",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.2105,
    lng: -3.1084,
  },

  {
    name: "Lutxana-Barakaldo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2878,
    lng: -2.9754,
  },

  {
    name: "Sant Joan Despí",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3686,
    lng: 2.0602,
  },

  {
    name: "Maestra Justa Freire-Polidep. Aluche",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3836,
    lng: -3.7687,
  },

  {
    name: "Ablaña",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2676,
    lng: -5.8058,
  },

  {
    name: "Manzanares",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 39.0058,
    lng: -3.3705,
  },

  {
    name: "Las Águilas",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.381,
    lng: -3.7802,
  },

  {
    name: "Crevillente",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.2246,
    lng: -0.7815,
  },

  {
    name: "Xuvia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.5172,
    lng: -8.1613,
  },

  {
    name: "Canet de Mar",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5867,
    lng: 2.5813,
  },

  {
    name: "Montcada i Reixac-Manresa",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4839,
    lng: 2.1854,
  },

  {
    name: "Puente San Miguel",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3587,
    lng: -4.0878,
  },

  {
    name: "Sant Feliu de Llobregat",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.383,
    lng: 2.0479,
  },

  {
    name: "Montmeló",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5497,
    lng: 2.2454,
  },

  {
    name: "Valls",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.2896,
    lng: 1.2587,
  },

  {
    name: "Oropesa de Toledo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.9217,
    lng: -5.1861,
  },

  {
    name: "Marçà-Falset",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.1309,
    lng: 0.8104,
  },

  {
    name: "Arenys de Mar",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5777,
    lng: 2.5493,
  },

  {
    name: "Vilches",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 38.2157,
    lng: -3.5176,
  },

  {
    name: "Celrà",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.0272,
    lng: 2.8749,
  },

  {
    name: "Colera",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.4069,
    lng: 3.1543,
  },

  {
    name: "Alzira",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.1531,
    lng: -0.4506,
  },

  {
    name: "Candás",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.5847,
    lng: -5.7727,
  },

  {
    name: "Peñaranda de Bracamonte",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 40.8981,
    lng: -5.2064,
  },

  {
    name: "El Puig",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.5883,
    lng: -0.3117,
  },

  {
    name: "El Chorro-Caminito del Rey",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.9073,
    lng: -4.7593,
  },

  {
    name: "Chiva",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 39.4711,
    lng: -0.7229,
  },

  {
    name: "Segunda Aguada",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.5135,
    lng: -6.277,
  },

  {
    name: "Carcaixent",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.1205,
    lng: -0.4544,
  },

  {
    name: "Torreblanca",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.2122,
    lng: 0.1988,
  },

  {
    name: "Les Borges del Camp",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.1665,
    lng: 1.0221,
  },

  {
    name: "Meres",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.381,
    lng: -5.7487,
  },

  {
    name: "Ortigueira",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.6862,
    lng: -7.8496,
  },

  {
    name: "Montgat",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.463,
    lng: 2.2722,
  },

  {
    name: "Robledo de Chavela",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5208,
    lng: -4.2468,
  },

  {
    name: "Cervera",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6736,
    lng: 1.2748,
  },

  {
    name: "Orpesa",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.0923,
    lng: 0.1399,
  },

  {
    name: "Zarzalejo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5389,
    lng: -4.1581,
  },

  {
    name: "San Sadurniño",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.5461,
    lng: -8.0781,
  },

  {
    name: "Cullera",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 39.1779,
    lng: -0.2632,
  },

  {
    name: "Móra la Nova",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.1066,
    lng: 0.6532,
  },

  {
    name: "Nueva Montaña apeadero",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.4447,
    lng: -3.8472,
  },

  {
    name: "Tolosa-Centro",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.1394,
    lng: -2.0741,
  },

  {
    name: "La Cantábrica",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3974,
    lng: -3.815,
  },

  {
    name: "La Rinconada",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.4801,
    lng: -5.9401,
  },

  {
    name: "Sueca",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 39.2058,
    lng: -0.3082,
  },

  {
    name: "Zaramillo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.2333,
    lng: -3.0159,
  },

  {
    name: "Puerto Real",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.5309,
    lng: -6.1853,
  },

  {
    name: "Brinkola",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.019,
    lng: -2.3347,
  },

  {
    name: "Gualba",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.7182,
    lng: 2.5388,
  },

  {
    name: "Tàrrega",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6504,
    lng: 1.139,
  },

  {
    name: "Narbonne",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 43.1903,
    lng: 3.0057,
  },

  {
    name: "Capçanes",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.1021,
    lng: 0.7804,
  },

  {
    name: "El Prat Aeroport",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3042,
    lng: 2.0734,
  },

  {
    name: "Bezana",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.4409,
    lng: -3.8996,
  },

  {
    name: "Desertu-Barakaldo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3,
    lng: -2.9844,
  },

  {
    name: "Caspe",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.2397,
    lng: -0.0427,
  },

  {
    name: "Puente Alcocer",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3504,
    lng: -3.7051,
  },

  {
    name: "Sant Andreu de Llavaneres",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5555,
    lng: 2.4983,
  },

  {
    name: "Cudillero",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.5509,
    lng: -6.1519,
  },

  {
    name: "La Pobla Llarga",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.0833,
    lng: -0.4697,
  },

  {
    name: "Majadahonda",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4743,
    lng: -3.8463,
  },

  {
    name: "Vilajuïga",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.3257,
    lng: 3.0875,
  },

  {
    name: "Villabona de Asturias",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.4615,
    lng: -5.8263,
  },

  {
    name: "Vallada",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 38.909,
    lng: -0.6902,
  },

  {
    name: "Mollet-Sant Fost",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5336,
    lng: 2.2177,
  },

  {
    name: "Victoria Kent",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.7012,
    lng: -4.4544,
  },

  {
    name: "Casetas",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.7226,
    lng: -1.0202,
  },

  {
    name: "Artxube",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.201,
    lng: -3.0715,
  },

  {
    name: "Elche/Elx-Parc",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.2718,
    lng: -0.6952,
  },

  {
    name: "Aeropuerto de Jerez",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.7516,
    lng: -6.0659,
  },

  {
    name: "Sabadell Centre",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5464,
    lng: 2.1156,
  },

  {
    name: "Lugo de Llanera",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.4423,
    lng: -5.8159,
  },

  {
    name: "Pinto",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.2429,
    lng: -3.7035,
  },

  {
    name: "Arrigorriaga",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2101,
    lng: -2.8886,
  },

  {
    name: "El Papiol",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4354,
    lng: 2.0026,
  },

  {
    name: "Doce de Octubre",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3789,
    lng: -3.6987,
  },

  {
    name: "Alcalá de Henares-Universidad",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5054,
    lng: -3.3353,
  },

  {
    name: "Embajadores",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4046,
    lng: -3.7026,
  },

  {
    name: "Álora",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 36.8199,
    lng: -4.6996,
  },

  {
    name: "Móstoles-El Soto",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3311,
    lng: -3.8825,
  },

  {
    name: "Cazalla-Constantina",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.9329,
    lng: -5.7044,
  },

  {
    name: "El Pozo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.376,
    lng: -3.6561,
  },

  {
    name: "Nava",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3612,
    lng: -5.5091,
  },

  {
    name: "Sant Sadurní d'Anoia",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4205,
    lng: 1.7947,
  },

  {
    name: "Calella",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.6147,
    lng: 2.666,
  },

  {
    name: "Veriña",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.5416,
    lng: -5.7228,
  },

  {
    name: "Calaf",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.7303,
    lng: 1.5151,
  },

  {
    name: "Ganzo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3565,
    lng: -4.0702,
  },

  {
    name: "Carancos",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3556,
    lng: -5.4344,
  },

  {
    name: "Les Valls",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.7193,
    lng: -0.2398,
  },

  {
    name: "Gelida",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4485,
    lng: 1.8655,
  },

  {
    name: "Barberà del Vallès",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5137,
    lng: 2.1185,
  },

  {
    name: "Alegría-Dulantzi",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.8487,
    lng: -2.5147,
  },

  {
    name: "Sabadell Nord",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.562,
    lng: 2.0962,
  },

  {
    name: "San José de Valderas",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3566,
    lng: -3.8156,
  },

  {
    name: "Barcelona Fabra i Puig",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4303,
    lng: 2.1833,
  },

  {
    name: "Ontoria",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3153,
    lng: -4.2154,
  },

  {
    name: "Fuente Santa de Nava",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3556,
    lng: -5.4784,
  },

  {
    name: "El Masnou",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.477,
    lng: 2.3104,
  },

  {
    name: "Valdemoro",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.1961,
    lng: -3.6649,
  },

  {
    name: "Villacañas",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 39.6227,
    lng: -3.3305,
  },

  {
    name: "La Llagosta",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5105,
    lng: 2.1997,
  },

  {
    name: "Anglesola",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6464,
    lng: 1.0792,
  },

  {
    name: "San Xoán",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.4946,
    lng: -8.2143,
  },

  {
    name: "Carvajal",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 36.5703,
    lng: -4.594,
  },

  {
    name: "Camp-redó",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.7592,
    lng: 0.5558,
  },

  {
    name: "Navalperal",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.5912,
    lng: -4.4084,
  },

  {
    name: "Illescas",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.1209,
    lng: -3.8423,
  },

  {
    name: "Bárcena",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.1287,
    lng: -4.0535,
  },

  {
    name: "Santa Eugenia",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.387,
    lng: -3.609,
  },

  {
    name: "Orcasitas",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3671,
    lng: -3.7042,
  },

  {
    name: "Llinars del Vallès",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.638,
    lng: 2.4045,
  },

  {
    name: "Mollerussa",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.6318,
    lng: 0.8968,
  },

  {
    name: "Santa María de la Alameda-Peguerinos",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 40.569,
    lng: -4.2691,
  },

  {
    name: "Madrid-Aeropuerto T4",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4924,
    lng: -3.5932,
  },

  {
    name: "Seguers-Sant Pere Sallavinera",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.748,
    lng: 1.5742,
  },

  {
    name: "Cornellà",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.3575,
    lng: 2.0705,
  },

  {
    name: "La Hoya",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 36.4112,
    lng: -6.1391,
  },

  {
    name: "Zorrotza Zorrozgoiti",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.274,
    lng: -2.974,
  },

  {
    name: "Parque Polvoranca",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.3126,
    lng: -3.7835,
  },

  {
    name: "Areta",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.1451,
    lng: -2.9434,
  },

  {
    name: "Las Cabezas de San Juan",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 37.0195,
    lng: -5.9466,
  },

  {
    name: "El Cáñamo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.4864,
    lng: -5.933,
  },

  {
    name: "Caldes d'Estrac",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.5686,
    lng: 2.526,
  },

  {
    name: "Cubelles",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.2043,
    lng: 1.676,
  },

  {
    name: "Sax",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.5443,
    lng: -0.8137,
  },

  {
    name: "Montgat-Nord",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4688,
    lng: 2.2867,
  },

  {
    name: "Posadas",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 37.804,
    lng: -5.1063,
  },

  {
    name: "San Clodio-Quiroga",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.4653,
    lng: -7.2872,
  },

  {
    name: "Ponferrada",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 42.5454,
    lng: -6.6024,
  },

  {
    name: "Sanlúcar la Mayor",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.3814,
    lng: -6.194,
  },

  {
    name: "Almenara",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.7488,
    lng: -0.2184,
  },

  {
    name: "Sodupe",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.202,
    lng: -3.0505,
  },

  {
    name: "Toledo",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 39.8623,
    lng: -4.0112,
  },

  {
    name: "València-Sant Isidre",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 39.4502,
    lng: -0.404,
  },

  {
    name: "Sant Pol de Mar",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.6018,
    lng: 2.6246,
  },

  {
    name: "El Pinillo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 36.6099,
    lng: -4.5154,
  },

  {
    name: "Torrellano",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 38.2896,
    lng: -0.5825,
  },

  {
    name: "Renedo",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.3531,
    lng: -3.9496,
  },

  {
    name: "Barredos",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.2599,
    lng: -5.575,
  },

  {
    name: "Santa Cruz de Llodio",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.1329,
    lng: -2.9698,
  },

  {
    name: "Cunit",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.195,
    lng: 1.6319,
  },

  {
    name: "Platja de Castelldefels",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.267,
    lng: 1.9571,
  },

  {
    name: "Vilamalla",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 42.2164,
    lng: 2.9778,
  },

  {
    name: "Chilches/Xilxes",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 39.7827,
    lng: -0.1903,
  },

  {
    name: "El Goloso",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.5589,
    lng: -3.714,
  },

  {
    name: "Pineda de Mar",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.6224,
    lng: 2.6936,
  },

  {
    name: "Soto de Rey",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3064,
    lng: -5.8558,
  },

  {
    name: "Garraf",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.2546,
    lng: 1.9025,
  },

  {
    name: "Jardines de Hércules",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.3329,
    lng: -5.9641,
  },

  {
    name: "El Barrial-Centro Comercial Pozuelo",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 40.4654,
    lng: -3.8077,
  },

  {
    name: "Gallarta",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3193,
    lng: -3.0675,
  },

  {
    name: "Cantillana",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 37.575,
    lng: -5.8032,
  },

  {
    name: "Cerdido",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 43.5873,
    lng: -7.9343,
  },

  {
    name: "Cortes de Navarra",
    country: "es",
    lines: ["Cercanías", "Larga distancia"],
    types: ["Urban", "Intercidades"],
    lat: 41.9151,
    lng: -1.4204,
  },

  {
    name: "Ventas de Irún",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 43.3304,
    lng: -1.8168,
  },

  {
    name: "Badajoz",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 38.8907,
    lng: -6.9818,
  },

  {
    name: "Montcada-Bifurcació",
    country: "es",
    lines: ["Cercanías"],
    types: ["Urban"],
    lat: 41.4698,
    lng: 2.18,
  },

];
