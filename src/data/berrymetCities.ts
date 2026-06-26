export type BerrymetCity = {
  id: number;
  name: string;
  country: "PT" | "ES";
  lat: number;
  lng: number;
};

/** Iberian cities covered on berrymet.com (from /api/cities). */
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
  { id: 33, name: "Santander", country: "ES", lat: 43.4623, lng: -3.8099 },
  { id: 34, name: "San Sebastián", country: "ES", lat: 43.3183, lng: -1.9812 },
  { id: 35, name: "Oviedo", country: "ES", lat: 43.3614, lng: -5.8593 },
  { id: 36, name: "Santiago de Compostela", country: "ES", lat: 42.8805, lng: -8.5456 },
  { id: 37, name: "Lugo", country: "ES", lat: 43.0097, lng: -7.5567 },
  { id: 38, name: "Pontevedra", country: "ES", lat: 42.429, lng: -8.6446 },
  { id: 39, name: "Ferrol", country: "ES", lat: 43.484, lng: -8.2335 },
  { id: 40, name: "Avilés", country: "ES", lat: 43.5564, lng: -5.9249 },
  { id: 41, name: "León", country: "ES", lat: 42.5987, lng: -5.5671 },
  { id: 42, name: "Burgos", country: "ES", lat: 42.344, lng: -3.6969 },
  { id: 43, name: "Lisboa", country: "PT", lat: 38.7223, lng: -9.1393 },
  { id: 44, name: "Porto", country: "PT", lat: 41.1579, lng: -8.6291 },
  { id: 45, name: "Vila Nova de Gaia", country: "PT", lat: 41.1239, lng: -8.6118 },
  { id: 46, name: "Amadora", country: "PT", lat: 38.7536, lng: -9.2302 },
  { id: 47, name: "Braga", country: "PT", lat: 41.5518, lng: -8.4229 },
  { id: 48, name: "Funchal", country: "PT", lat: 32.6669, lng: -16.9241 },
  { id: 49, name: "Coimbra", country: "PT", lat: 40.2033, lng: -8.4103 },
  { id: 50, name: "Setúbal", country: "PT", lat: 38.5244, lng: -8.8882 },
  { id: 51, name: "Aveiro", country: "PT", lat: 40.6443, lng: -8.6455 },
  { id: 52, name: "Évora", country: "PT", lat: 38.5664, lng: -7.9077 },
  { id: 53, name: "Faro", country: "PT", lat: 37.0194, lng: -7.9322 },
  { id: 54, name: "Leiria", country: "PT", lat: 39.7437, lng: -8.8071 },
  { id: 55, name: "Viana do Castelo", country: "PT", lat: 41.693, lng: -8.8347 },
  { id: 56, name: "Viseu", country: "PT", lat: 40.6566, lng: -7.9122 },
  { id: 57, name: "Ponta Delgada", country: "PT", lat: 37.7394, lng: -25.6681 },
  { id: 58, name: "Vila Real", country: "PT", lat: 41.300598, lng: -7.744103 },
];
