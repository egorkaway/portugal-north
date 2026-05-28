import type { Hotel } from "@/data/hotels";

function bookingSearch(place: string) {
  const ss = encodeURIComponent(`${place}, Portugal`);
  return `https://www.booking.com/searchresults.html?ss=${ss}&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price`;
}

/** Budget stays within ~2 km; names from Booking / OSM near each terminus. */
export const metroStationHotels: Record<string, Hotel[]> = {
  "Estádio do Dragão": [
    {
      name: "Hotel Campanile Porto",
      distanceKm: 0.6,
      priceFrom: 45,
      bookingUrl: "https://www.booking.com/hotel/pt/campanile-porto.html",
    },
    {
      name: "Stay Hotel Porto Centro Trindade",
      distanceKm: 1.8,
      priceFrom: 42,
      bookingUrl: bookingSearch("Porto Campanhã"),
    },
    {
      name: "Ibis Budget Porto Centro",
      distanceKm: 1.5,
      priceFrom: 40,
      bookingUrl: "https://www.booking.com/hotel/pt/ibis-budget-porto-centro.html",
    },
  ],
  "Senhor de Matosinhos": [
    {
      name: "Hotel Mar e Sol",
      distanceKm: 0.4,
      priceFrom: 38,
      bookingUrl: bookingSearch("Matosinhos"),
    },
    {
      name: "Hotel Praia Mar",
      distanceKm: 0.8,
      priceFrom: 45,
      bookingUrl: bookingSearch("Matosinhos beach"),
    },
    {
      name: "NH Collection Porto Marina",
      distanceKm: 1.2,
      priceFrom: 55,
      bookingUrl: bookingSearch("Matosinhos"),
    },
  ],
  "Póvoa de Varzim": [
    {
      name: "Hotel Luso Brasileiro",
      distanceKm: 0.5,
      priceFrom: 35,
      bookingUrl: bookingSearch("Póvoa de Varzim"),
    },
    {
      name: "Hotel Avenida",
      distanceKm: 0.7,
      priceFrom: 40,
      bookingUrl: bookingSearch("Póvoa de Varzim"),
    },
    {
      name: "Pensão Central",
      distanceKm: 0.3,
      priceFrom: 30,
      bookingUrl: bookingSearch("Póvoa de Varzim"),
    },
  ],
  "Campanhã (Metro)": [
    {
      name: "Campanha Boutique Station B&B",
      distanceKm: 0.2,
      priceFrom: 38,
      bookingUrl: "https://www.booking.com/hotel/pt/campanha-boutique-station.html",
    },
    {
      name: "ABC Hotel Porto Campanhã",
      distanceKm: 0.4,
      priceFrom: 40,
      bookingUrl: "https://www.booking.com/hotel/pt/abc-porto.html",
    },
    {
      name: "Star Inn Porto",
      distanceKm: 1.2,
      priceFrom: 42,
      bookingUrl: "https://www.booking.com/hotel/pt/star-inn-porto.html",
    },
  ],
  ISMAI: [
    {
      name: "Hotel Ibis Porto Sul",
      distanceKm: 1.5,
      priceFrom: 42,
      bookingUrl: bookingSearch("Maia Portugal"),
    },
    {
      name: "Hotel Fundador",
      distanceKm: 1.8,
      priceFrom: 38,
      bookingUrl: bookingSearch("Maia"),
    },
    {
      name: "Residencial Ouro",
      distanceKm: 1.2,
      priceFrom: 32,
      bookingUrl: bookingSearch("Maia"),
    },
  ],
  "Hospital São João (Metro)": [
    {
      name: "Hotel Premium Porto",
      distanceKm: 1.0,
      priceFrom: 40,
      bookingUrl: bookingSearch("Porto Hospital São João"),
    },
    {
      name: "Residencial Pedra Antiga",
      distanceKm: 1.5,
      priceFrom: 35,
      bookingUrl: bookingSearch("Porto Paranhos"),
    },
    {
      name: "Hotel Cristal Porto",
      distanceKm: 1.8,
      priceFrom: 45,
      bookingUrl: bookingSearch("Porto"),
    },
  ],
  "Vila d'Este": [
    {
      name: "Hotel Ibis Braga",
      distanceKm: 1.5,
      priceFrom: 40,
      bookingUrl: bookingSearch("Vila Nova de Gaia"),
    },
    {
      name: "Hotel Parque das Camélias",
      distanceKm: 1.8,
      priceFrom: 38,
      bookingUrl: bookingSearch("Gondomar"),
    },
    {
      name: "Residencial Carvalho",
      distanceKm: 1.2,
      priceFrom: 30,
      bookingUrl: bookingSearch("Gondomar"),
    },
  ],
  "Trindade (Metro)": [
    {
      name: "Mystay Porto São Bento",
      distanceKm: 0.4,
      priceFrom: 45,
      bookingUrl: "https://www.booking.com/hotel/pt/mystay-porto-sao-bento.html",
    },
    {
      name: "Hotel Dom Henrique Downtown",
      distanceKm: 0.3,
      priceFrom: 48,
      bookingUrl: bookingSearch("Porto Trindade"),
    },
    {
      name: "H.ö.H Guest House Porto",
      distanceKm: 0.5,
      priceFrom: 42,
      bookingUrl: "https://www.booking.com/hotel/pt/h-o-h-guest-house.html",
    },
  ],
  "Estação Aeroporto": [
    {
      name: "Hotel Aeroporto",
      distanceKm: 0.3,
      priceFrom: 45,
      bookingUrl: bookingSearch("Porto Airport"),
    },
    {
      name: "Holiday Inn Express Porto Airport",
      distanceKm: 0.5,
      priceFrom: 55,
      bookingUrl: "https://www.booking.com/hotel/pt/holiday-inn-express-porto-airport.html",
    },
    {
      name: "Park Hotel Porto Aeroporto",
      distanceKm: 0.8,
      priceFrom: 42,
      bookingUrl: bookingSearch("Maia Porto airport"),
    },
  ],
  Fânzeres: [
    {
      name: "Hotel Ibis Porto Sul",
      distanceKm: 1.2,
      priceFrom: 42,
      bookingUrl: bookingSearch("Gondomar"),
    },
    {
      name: "Residencial São José",
      distanceKm: 0.8,
      priceFrom: 32,
      bookingUrl: bookingSearch("Gondomar"),
    },
    {
      name: "Hotel Fundador",
      distanceKm: 1.5,
      priceFrom: 38,
      bookingUrl: bookingSearch("Gondomar"),
    },
  ],
  "Senhora da Hora": [
    {
      name: "Hotel Ibis Porto Matosinhos",
      distanceKm: 0.8,
      priceFrom: 42,
      bookingUrl: bookingSearch("Senhora da Hora"),
    },
    {
      name: "Hotel Parque",
      distanceKm: 1.0,
      priceFrom: 38,
      bookingUrl: bookingSearch("Matosinhos"),
    },
    {
      name: "Residencial Perola",
      distanceKm: 0.6,
      priceFrom: 35,
      bookingUrl: bookingSearch("Matosinhos"),
    },
  ],
  "Santa Apolónia (Metro)": [
    {
      name: "Hotel Santa Apolónia",
      distanceKm: 0.2,
      priceFrom: 40,
      bookingUrl: bookingSearch("Santa Apolónia Lisbon"),
    },
    {
      name: "Hotel Convento do Salvador",
      distanceKm: 0.8,
      priceFrom: 45,
      bookingUrl: bookingSearch("Alfama Lisbon"),
    },
    {
      name: "Memmo Alfama Hotel",
      distanceKm: 0.9,
      priceFrom: 55,
      bookingUrl: bookingSearch("Alfama"),
    },
  ],
  "Amadora Este": [
    {
      name: "Hotel Real",
      distanceKm: 0.5,
      priceFrom: 35,
      bookingUrl: bookingSearch("Amadora"),
    },
    {
      name: "Hotel Lisboa Plaza Amadora",
      distanceKm: 0.8,
      priceFrom: 38,
      bookingUrl: bookingSearch("Amadora"),
    },
    {
      name: "Residencial Colibri",
      distanceKm: 0.6,
      priceFrom: 32,
      bookingUrl: bookingSearch("Amadora"),
    },
  ],
  Rato: [
    {
      name: "Hotel Borges",
      distanceKm: 0.6,
      priceFrom: 45,
      bookingUrl: bookingSearch("Rato Lisbon"),
    },
    {
      name: "Hotel Lisboa Plaza",
      distanceKm: 0.5,
      priceFrom: 48,
      bookingUrl: "https://www.booking.com/hotel/pt/lisboa-plaza.html",
    },
    {
      name: "Hotel Londres",
      distanceKm: 0.4,
      priceFrom: 42,
      bookingUrl: bookingSearch("Rato"),
    },
  ],
  Odivelas: [
    {
      name: "Hotel Odivelas",
      distanceKm: 0.4,
      priceFrom: 35,
      bookingUrl: bookingSearch("Odivelas"),
    },
    {
      name: "Hotel Ibis Lisboa Odivelas",
      distanceKm: 0.6,
      priceFrom: 42,
      bookingUrl: bookingSearch("Odivelas"),
    },
    {
      name: "Residencial Odivelas",
      distanceKm: 0.5,
      priceFrom: 30,
      bookingUrl: bookingSearch("Odivelas"),
    },
  ],
  "Cais do Sodré (Metro)": [
    {
      name: "Hotel Lisboa Baixa",
      distanceKm: 0.5,
      priceFrom: 45,
      bookingUrl: bookingSearch("Cais do Sodré"),
    },
    {
      name: "Brown's Central Hotel",
      distanceKm: 0.6,
      priceFrom: 50,
      bookingUrl: bookingSearch("Baixa Lisbon"),
    },
    {
      name: "Hotel da Baixa",
      distanceKm: 0.7,
      priceFrom: 48,
      bookingUrl: bookingSearch("Baixa-Chiado"),
    },
  ],
  Telheiras: [
    {
      name: "Hotel Novotel Lisboa",
      distanceKm: 1.2,
      priceFrom: 48,
      bookingUrl: bookingSearch("Telheiras"),
    },
    {
      name: "Hotel Roma",
      distanceKm: 1.0,
      priceFrom: 42,
      bookingUrl: bookingSearch("Lisbon Telheiras"),
    },
    {
      name: "Residencial Marisela",
      distanceKm: 0.8,
      priceFrom: 35,
      bookingUrl: bookingSearch("Lumiar Lisbon"),
    },
  ],
  "São Sebastião (Metro)": [
    {
      name: "Hotel Exe Liberdade",
      distanceKm: 0.5,
      priceFrom: 48,
      bookingUrl: bookingSearch("Avenida da Liberdade"),
    },
    {
      name: "Hotel Lisboa Plaza",
      distanceKm: 0.6,
      priceFrom: 48,
      bookingUrl: "https://www.booking.com/hotel/pt/lisboa-plaza.html",
    },
    {
      name: "Hotel Borges",
      distanceKm: 0.8,
      priceFrom: 45,
      bookingUrl: bookingSearch("Marquês de Pombal"),
    },
  ],
  "Aeroporto (Metro Lisboa)": [
    {
      name: "Hotel 3K Aeroporto",
      distanceKm: 0.4,
      priceFrom: 45,
      bookingUrl: bookingSearch("Lisbon Airport"),
    },
    {
      name: "Hotel Star Inn Lisbon Airport",
      distanceKm: 0.5,
      priceFrom: 42,
      bookingUrl: bookingSearch("Lisbon Airport"),
    },
    {
      name: "Holiday Inn Express Lisbon Airport",
      distanceKm: 0.6,
      priceFrom: 50,
      bookingUrl: bookingSearch("Lisbon Airport"),
    },
  ],
};
