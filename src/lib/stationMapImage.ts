import { stationToSlug } from "@/lib/stationSlug";

/** Square 1080×1080 area map path when generated under public/maps/stations/. */
export function getStationMapImagePath(stationName: string): string {
  return `/maps/stations/${stationToSlug(stationName)}.png`;
}
