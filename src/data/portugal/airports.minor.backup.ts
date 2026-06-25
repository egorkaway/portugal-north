import type { Hotel } from "../hotels";
import type { Station } from "../stationTypes";

/**
 * Inactive minor Portuguese airports — kept for future re-enable.
 * Not included in stationRegistry or end-user routes.
 */
export const portugalMinorAirports: Station[] = [
  {
    name: "Beja Airport (BYJ)",
    country: "pt",
    lines: ["BYJ"],
    types: ["Airport"],
    lat: 38.0789,
    lng: -7.9324,
  },
  {
    name: "Cascais Airport (CAT)",
    country: "pt",
    lines: ["CAT"],
    types: ["Airport"],
    lat: 38.725,
    lng: -9.3553,
  },
  {
    name: "Coimbra Airport (CBP)",
    country: "pt",
    lines: ["CBP"],
    types: ["Airport"],
    lat: 40.1572,
    lng: -8.4697,
  },
  {
    name: "Évora Airport",
    country: "pt",
    lines: ["LPEV"],
    types: ["Airport"],
    lat: 38.5336,
    lng: -7.8897,
  },
  {
    name: "Portimão Airport (PRM)",
    country: "pt",
    lines: ["PRM"],
    types: ["Airport"],
    lat: 37.1493,
    lng: -8.5839,
  },
  {
    name: "Vila Real Airport (VRL)",
    country: "pt",
    lines: ["VRL"],
    types: ["Airport"],
    lat: 41.2744,
    lng: -7.7203,
  },
  {
    name: "Braga Airport (BGZ)",
    country: "pt",
    lines: ["BGZ"],
    types: ["Airport"],
    lat: 41.5875,
    lng: -8.4453,
  },
  {
    name: "Bragança Airport (BGC)",
    country: "pt",
    lines: ["BGC"],
    types: ["Airport"],
    lat: 41.8578,
    lng: -6.7072,
  },
  {
    name: "Chaves Airport (CHV)",
    country: "pt",
    lines: ["CHV"],
    types: ["Airport"],
    lat: 41.7228,
    lng: -7.4631,
  },
  {
    name: "Castelo Branco Airport",
    country: "pt",
    lines: ["LPCB"],
    types: ["Airport"],
    lat: 39.8472,
    lng: -7.4411,
  },
  {
    name: "Espinho Airport",
    country: "pt",
    lines: ["LPIN"],
    types: ["Airport"],
    lat: 41.0,
    lng: -8.6333,
  },
];

export const portugalMinorAirportHotels: Record<string, Hotel[]> = {
  "Beja Airport (BYJ)": [
    { name: "Diabrória", distanceKm: 3.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Diabr%C3%B3ria%2C%20Beja%20Airport%20(BYJ)%2C%20Portugal&order=price" },
    { name: "Holiday Inn", distanceKm: 8.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Holiday%20Inn%2C%20Beja%20Airport%20(BYJ)%2C%20Portugal&order=price" },
    { name: "Sesmarias Turismo Rural & Spa", distanceKm: 8.9, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sesmarias%20Turismo%20Rural%20%26%20Spa%2C%20Beja%20Airport%20(BYJ)%2C%20Portugal&order=price" },
  ],
  "Cascais Airport (CAT)": [
    { name: "Seminário Torre D' Aguilha - Hotel", distanceKm: 2.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Semin%C3%A1rio%20Torre%20D'%20Aguilha%20-%20Hotel%2C%20Cascais%20Airport%20(CAT)%2C%20Portugal&order=price" },
    { name: "Dolce Vita Guesthouse", distanceKm: 3.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Dolce%20Vita%20Guesthouse%2C%20Cascais%20Airport%20(CAT)%2C%20Portugal&order=price" },
    { name: "Casa", distanceKm: 3.7, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%2C%20Cascais%20Airport%20(CAT)%2C%20Portugal&order=price" },
  ],
  "Coimbra Airport (CBP)": [
    { name: "Jantesta Guest House", distanceKm: 1.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Jantesta%20Guest%20House%2C%20Coimbra%20Airport%20(CBP)%2C%20Portugal&order=price" },
    { name: "Albergue de Peregrinos Cernache", distanceKm: 2.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20de%20Peregrinos%20Cernache%2C%20Coimbra%20Airport%20(CBP)%2C%20Portugal&order=price" },
    { name: "Casa Amazon", distanceKm: 3.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20Amazon%2C%20Coimbra%20Airport%20(CBP)%2C%20Portugal&order=price" },
  ],
  "Évora Airport": [
    { name: "Monte da Serralheira", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20da%20Serralheira%2C%20%C3%89vora%20Airport%2C%20Portugal&order=price" },
    { name: "Hospedaria d'El Rei", distanceKm: 3.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20d'El%20Rei%2C%20%C3%89vora%20Airport%2C%20Portugal&order=price" },
    { name: "Hotel Dom Fernando", distanceKm: 3.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Dom%20Fernando%2C%20%C3%89vora%20Airport%2C%20Portugal&order=price" },
  ],
  "Portimão Airport (PRM)": [
    { name: "Penina Hotel & Golf Resort", distanceKm: 1.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Penina%20Hotel%20%26%20Golf%20Resort%2C%20Portim%C3%A3o%20Airport%20(PRM)%2C%20Portugal&order=price" },
    { name: "Pelican Alvor", distanceKm: 1.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pelican%20Alvor%2C%20Portim%C3%A3o%20Airport%20(PRM)%2C%20Portugal&order=price" },
    { name: "Longevity Health & Wellness Hotel", distanceKm: 2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Longevity%20Health%20%26%20Wellness%20Hotel%2C%20Portim%C3%A3o%20Airport%20(PRM)%2C%20Portugal&order=price" },
  ],
  "Vila Real Airport (VRL)": [
    { name: "A Casa da Sofia", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=A%20Casa%20da%20Sofia%2C%20Vila%20Real%20Airport%20(VRL)%2C%20Portugal&order=price" },
    { name: "Casa de Trás-o-Muro", distanceKm: 1.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20de%20Tr%C3%A1s-o-Muro%2C%20Vila%20Real%20Airport%20(VRL)%2C%20Portugal&order=price" },
    { name: "Hotel Quinta do Paço", distanceKm: 2.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Quinta%20do%20Pa%C3%A7o%2C%20Vila%20Real%20Airport%20(VRL)%2C%20Portugal&order=price" },
  ],
  "Braga Airport (BGZ)": [
    { name: "Motel Horly", distanceKm: 0.5, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Motel%20Horly%2C%20Braga%20Airport%20(BGZ)%2C%20Portugal&order=price" },
    { name: "Bom Sucesso", distanceKm: 2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bom%20Sucesso%2C%20Braga%20Airport%20(BGZ)%2C%20Portugal&order=price" },
    { name: "Casanova Farmhouse", distanceKm: 3.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casanova%20Farmhouse%2C%20Braga%20Airport%20(BGZ)%2C%20Portugal&order=price" },
  ],
  "Bragança Airport (BGC)": [
    { name: "Hotel Turismo São Lázaro", distanceKm: 5.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Turismo%20S%C3%A3o%20L%C3%A1zaro%2C%20Bragan%C3%A7a%20Airport%20(BGC)%2C%20Portugal&order=price" },
    { name: "Quinta da Rica-Fé Agroturismo", distanceKm: 5.9, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20da%20Rica-F%C3%A9%20Agroturismo%2C%20Bragan%C3%A7a%20Airport%20(BGC)%2C%20Portugal&order=price" },
    { name: "Ibis Bragança", distanceKm: 6.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ibis%20Bragan%C3%A7a%2C%20Bragan%C3%A7a%20Airport%20(BGC)%2C%20Portugal&order=price" },
  ],
  "Chaves Airport (CHV)": [
    { name: "Hotel Encostas de Nantes", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Encostas%20de%20Nantes%2C%20Chaves%20Airport%20(CHV)%2C%20Portugal&order=price" },
    { name: "Hotel Brites", distanceKm: 1.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Brites%2C%20Chaves%20Airport%20(CHV)%2C%20Portugal&order=price" },
    { name: "Hotel 4 Estações", distanceKm: 1.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%204%20Esta%C3%A7%C3%B5es%2C%20Chaves%20Airport%20(CHV)%2C%20Portugal&order=price" },
  ],
  "Castelo Branco Airport": [
    { name: "Casa 3", distanceKm: 4.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%203%2C%20Castelo%20Branco%20Airport%2C%20Portugal&order=price" },
    { name: "Residencial Horta d' Alva", distanceKm: 4.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Horta%20d'%20Alva%2C%20Castelo%20Branco%20Airport%2C%20Portugal&order=price" },
    { name: "Império do Rei", distanceKm: 4.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Imp%C3%A9rio%20do%20Rei%2C%20Castelo%20Branco%20Airport%2C%20Portugal&order=price" },
  ],
  "Espinho Airport": [
    { name: "Pousada da Juventude Espinho", distanceKm: 0.9, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pousada%20da%20Juventude%20Espinho%2C%20Espinho%20Airport%2C%20Portugal&order=price" },
    { name: "Alameda Guest House", distanceKm: 1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alameda%20Guest%20House%2C%20Espinho%20Airport%2C%20Portugal&order=price" },
    { name: "Surf House", distanceKm: 1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Surf%20House%2C%20Espinho%20Airport%2C%20Portugal&order=price" },
  ],
};

export const portugalMinorAirportImages: Record<string, string> = {
  "Beja Airport (BYJ)": "https://images.pexels.com/photos/11372496/pexels-photo-11372496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Braga Airport (BGZ)": "https://images.pexels.com/photos/34493897/pexels-photo-34493897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Bragança Airport (BGC)": "https://images.pexels.com/photos/5838963/pexels-photo-5838963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Cascais Airport (CAT)": "https://images.pexels.com/photos/9953781/pexels-photo-9953781.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Castelo Branco Airport": "https://images.pexels.com/photos/886205/pexels-photo-886205.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Chaves Airport (CHV)": "https://images.pexels.com/photos/37360995/pexels-photo-37360995.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Coimbra Airport (CBP)": "https://images.pexels.com/photos/33687318/pexels-photo-33687318.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Espinho Airport": "https://images.pexels.com/photos/11498779/pexels-photo-11498779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Évora Airport": "https://images.pexels.com/photos/5810858/pexels-photo-5810858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Portimão Airport (PRM)": "https://images.pexels.com/photos/11411085/pexels-photo-11411085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "Vila Real Airport (VRL)": "https://images.pexels.com/photos/36717202/pexels-photo-36717202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};
