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
};
