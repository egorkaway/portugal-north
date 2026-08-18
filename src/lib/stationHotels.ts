import { metroStationHotels } from "@/data/metroStationAssets";
import { pinnedStationHotels } from "@/data/pinnedHotels";
import { stationHotels, type Hotel } from "@/data/hotels";

/** Auto-generated Booking search placeholders, not real properties. */
const PLACEHOLDER_HOTEL_NAME =
  /^(Hotels|Guest houses|Budget stays) near |^(Budget hotels|Guest houses|Hostels) · /i;

export function isPlaceholderHotel(hotel: Hotel): boolean {
  return PLACEHOLDER_HOTEL_NAME.test(hotel.name);
}

function foldStationName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function hotelNameKey(name: string): string {
  return foldStationName(name).replace(/[^a-z0-9]+/g, " ").trim();
}

function lookupByStationName(map: Record<string, Hotel[] | undefined>, stationName: string): Hotel[] {
  const direct = map[stationName];
  if (direct?.length) return direct;
  const folded = foldStationName(stationName);
  for (const [key, value] of Object.entries(map)) {
    if (value?.length && foldStationName(key) === folded) return value;
  }
  return [];
}

/** Pinned listings first, then the rest without duplicates. */
export function mergePinnedHotelsForStation(stationName: string, hotels: Hotel[]): Hotel[] {
  const pins = lookupByStationName(pinnedStationHotels, stationName);
  if (pins.length === 0) return hotels;
  const pinKeys = new Set(pins.map((hotel) => hotelNameKey(hotel.name)));
  return [...pins, ...hotels.filter((hotel) => !pinKeys.has(hotelNameKey(hotel.name)))];
}

/** Curated hotels for a station (excludes generic placeholders). */
export function getHotelsForStation(stationName: string): Hotel[] {
  const listed = lookupByStationName(stationHotels, stationName);
  const hotels = listed.length > 0 ? listed : lookupByStationName(metroStationHotels, stationName);
  return mergePinnedHotelsForStation(stationName, hotels).filter((hotel) => !isPlaceholderHotel(hotel));
}
