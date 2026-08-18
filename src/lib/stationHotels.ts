import { metroStationHotels } from "@/data/metroStationAssets";
import { pinnedStationHotels } from "@/data/pinnedHotels";
import { stationHotels, type Hotel } from "@/data/hotels";
import { canonicalHotelName } from "@/lib/hotelVoteAliases";

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
  const pinCanonicals = new Set(
    pins.map((hotel) => hotelNameKey(canonicalHotelName(stationName, hotel.name))),
  );
  return [
    ...pins,
    ...hotels.filter((hotel) => {
      if (pinKeys.has(hotelNameKey(hotel.name))) return false;
      return !pinCanonicals.has(hotelNameKey(canonicalHotelName(stationName, hotel.name)));
    }),
  ];
}

/** Keep one row when catalog names are aliases of the same property. */
function coalesceAliasedHotels(stationName: string, hotels: Hotel[]): Hotel[] {
  const seen = new Set<string>();
  const out: Hotel[] = [];
  for (const hotel of hotels) {
    const canonicalName = canonicalHotelName(stationName, hotel.name);
    const key = hotelNameKey(canonicalName);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(canonicalName === hotel.name ? hotel : { ...hotel, name: canonicalName });
  }
  return out;
}

/** Curated hotels for a station (excludes generic placeholders). */
export function getHotelsForStation(stationName: string): Hotel[] {
  const listed = lookupByStationName(stationHotels, stationName);
  const hotels = listed.length > 0 ? listed : lookupByStationName(metroStationHotels, stationName);
  return coalesceAliasedHotels(
    stationName,
    mergePinnedHotelsForStation(stationName, hotels).filter((hotel) => !isPlaceholderHotel(hotel)),
  );
}
