import { berrymetCities, type BerrymetCity } from "@/data/berrymetCities";
import type { Station } from "@/data/stationTypes";
import { distanceKm } from "@/lib/geo";

export const BERRYMET_BASE_URL = "https://berrymet.com";

/** Max distance from station to berrymet city centre for showing a weather link. */
export const BERRYMET_CITY_MAX_DISTANCE_KM = 30;

function berrymetCountryForStation(
  station: Pick<Station, "country">,
): BerrymetCity["country"] | null {
  if (station.country === "es") return "ES";
  if (station.country === "pt") return "PT";
  return null;
}

export type BerrymetCityLink = {
  cityName: string;
  href: string;
  distanceKm: number;
};

export function getBerrymetCityLink(
  station: Pick<Station, "name" | "country" | "lat" | "lng">,
): BerrymetCityLink | null {
  const country = berrymetCountryForStation(station);
  if (!country) return null;
  let nearest: BerrymetCity | null = null;
  let nearestDistance = Infinity;

  for (const city of berrymetCities) {
    if (city.country !== country) continue;
    const km = distanceKm(station.lat, station.lng, city.lat, city.lng);
    if (km < nearestDistance) {
      nearestDistance = km;
      nearest = city;
    }
  }

  if (!nearest || nearestDistance > BERRYMET_CITY_MAX_DISTANCE_KM) return null;

  return {
    cityName: nearest.name,
    href: `${BERRYMET_BASE_URL}/g/${nearest.id}`,
    distanceKm: nearestDistance,
  };
}

/** @deprecated Berrymet city pages use numeric ids (/g/:id), not slug paths. */
export function berrymetCitySlug(cityName: string): string {
  return cityName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
