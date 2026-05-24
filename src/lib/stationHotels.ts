import { stationHotels, type Hotel } from "@/data/hotels";

/** Auto-generated Booking search placeholders, not real properties. */
const PLACEHOLDER_HOTEL_NAME =
  /^(Hotels|Guest houses|Budget stays) near /i;

export function isPlaceholderHotel(hotel: Hotel): boolean {
  return PLACEHOLDER_HOTEL_NAME.test(hotel.name);
}

/** Curated hotels for a station (excludes generic placeholders). */
export function getHotelsForStation(stationName: string): Hotel[] {
  return (stationHotels[stationName] ?? []).filter((hotel) => !isPlaceholderHotel(hotel));
}
