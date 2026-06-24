import type { Station } from "../stationTypes";

/**
 * Spanish stations reachable on timetabled passenger services from Vigo.
 * Sources: Adif live boards (vigo-guixar, vigo-urzaiz), Renfe Eje Atlántico press
 * releases, seat61.com Vigo station guide, egtre.info Galicia sparse services.
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
    lines: ["Eje Atlántico"],
    types: ["Regional"],
    lat: 42.288,
    lng: -8.6096,
  },
  {
    name: "Pontevedra",
    country: "es",
    lines: ["Eje Atlántico"],
    types: ["Regional"],
    lat: 42.4242,
    lng: -8.6447,
  },
  {
    name: "Vilagarcía de Arousa",
    country: "es",
    lines: ["Eje Atlántico"],
    types: ["Regional"],
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
    lines: ["Eje Atlántico"],
    types: ["Regional", "Intercidades"],
    lat: 42.9063,
    lng: -8.5289,
  },
  {
    name: "A Coruña",
    country: "es",
    lines: ["Eje Atlántico"],
    types: ["Regional", "Intercidades"],
    lat: 43.3533,
    lng: -8.4022,
  },
  {
    name: "O Porriño",
    country: "es",
    lines: ["Eje Atlántico", "Minho (fronteira)"],
    types: ["Regional"],
    lat: 42.1619,
    lng: -8.6197,
  },
  {
    name: "Ourense",
    country: "es",
    lines: ["Eje Atlántico", "Línea Ourense–León"],
    types: ["Regional", "Intercidades"],
    lat: 42.3361,
    lng: -7.8653,
  },
  {
    name: "Madrid-Chamartín",
    country: "es",
    lines: ["Línea de alta velocidad (Madrid–Galicia)"],
    types: ["Intercidades"],
    lat: 40.472,
    lng: -3.6823,
  },
  {
    name: "Barcelona-Sants",
    country: "es",
    lines: ["Larga distancia"],
    types: ["Intercidades"],
    lat: 41.3794,
    lng: 2.1403,
  },
];
