export type BerrymetCity = {
  id: number;
  name: string;
  country: "PT" | "ES";
  lat: number;
  lng: number;
};

/** Cities with live pages on berrymet.com (GET /api/cities/major). Regenerate: npm run berrymet:sync */
export const berrymetCities: BerrymetCity[] = [
  { id: 20, name: "Madrid", country: "ES", lat: 40.4168, lng: -3.7038 },
  { id: 21, name: "Barcelona", country: "ES", lat: 41.3851, lng: 2.1734 },
  { id: 22, name: "Valencia", country: "ES", lat: 39.4699, lng: -0.3763 },
  { id: 23, name: "Sevilla", country: "ES", lat: 37.3891, lng: -5.9845 },
  { id: 24, name: "Zaragoza", country: "ES", lat: 41.6488, lng: -0.8891 },
  { id: 25, name: "Málaga", country: "ES", lat: 36.7213, lng: -4.4214 },
  { id: 26, name: "Murcia", country: "ES", lat: 37.9922, lng: -1.1307 },
  { id: 27, name: "Palma", country: "ES", lat: 39.5696, lng: 2.6502 },
  { id: 28, name: "Las Palmas", country: "ES", lat: 28.1235, lng: -15.4363 },
  { id: 29, name: "Bilbao", country: "ES", lat: 43.2627, lng: -2.9253 },
  { id: 30, name: "Vigo", country: "ES", lat: 42.2406, lng: -8.7207 },
  { id: 31, name: "A Coruña", country: "ES", lat: 43.3623, lng: -8.4115 },
  { id: 32, name: "Gijón", country: "ES", lat: 43.5322, lng: -5.6611 },
  { id: 35, name: "Oviedo", country: "ES", lat: 43.3614, lng: -5.8593 },
  { id: 43, name: "Lisboa", country: "PT", lat: 38.7223, lng: -9.1393 },
  { id: 44, name: "Porto", country: "PT", lat: 41.1579, lng: -8.6291 },
  { id: 45, name: "Vila Nova de Gaia", country: "PT", lat: 41.1239, lng: -8.6118 },
  { id: 48, name: "Funchal", country: "PT", lat: 32.6669, lng: -16.9241 },
  { id: 57, name: "Ponta Delgada", country: "PT", lat: 37.7394, lng: -25.6681 },
];
