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
    lat: 42.2314,
    lng: -8.7126,
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

];
