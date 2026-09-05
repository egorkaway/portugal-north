import type { StationHotels } from "./hotels";

/**
 * Hand-picked listings that hotel syncs (OSM expand, Booking audits, stub seeds)
 * must keep. `writeHotelMap` and `getHotelsForStation` merge these in so a later
 * rewrite of `hotels.ts` cannot drop them.
 *
 * Keys and hotel objects must stay in the same quoted form as `hotels.ts` so
 * `parseHotelMap` can read this file.
 */
export const pinnedStationHotels: StationHotels = {
  "Esqueiró": [
    { name: "Luan Café Lanhelas", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/hotel/pt/luan-cafe-lanhelas.html" },
  ],
  "Vila Nova de Cerveira": [
    { name: "HI Vila Nova de Cerveira - Pousada de Juventude", distanceKm: 0.7, priceFrom: 25, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-juventude-de-vila-nova-de-cerveira.html" },
  ],
  "Vigo-Urzáiz": [
    { name: "Hotel Lino", distanceKm: 0.2, priceFrom: 48, bookingUrl: "https://www.booking.com/hotel/es/lino.html" },
  ],
};
