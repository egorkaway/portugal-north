import { berrymetCities, type BerrymetCity } from "@/data/berrymetCities";
import type { Station } from "@/data/stationTypes";
import { distanceKm } from "@/lib/geo";

export const BERRYMET_BASE_URL = "https://berrymet.com";

/** Max distance from station to berrymet city centre for showing a weather link. */
export const BERRYMET_CITY_MAX_DISTANCE_KM = 30;

const slugByCityName = new Map(
  berrymetCities.map((city) => [city.name, berrymetCitySlug(city.name)]),
);

/** Station → city slug when geo match is slightly beyond the default radius. */
const STATION_BERRYMET_CITY_SLUG: Record<string, string> = {
  Valença: "viana-do-castelo",
};

export function berrymetCitySlug(cityName: string): string {
  return cityName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function berrymetCountryForStation(station: Pick<Station, "country">): BerrymetCity["country"] {
  return station.country === "es" ? "ES" : "PT";
}

function cityBySlug(slug: string): BerrymetCity | undefined {
  return berrymetCities.find((city) => berrymetCitySlug(city.name) === slug);
}

export type BerrymetCityLink = {
  cityName: string;
  href: string;
  distanceKm: number;
};

export function getBerrymetCityLink(
  station: Pick<Station, "name" | "country" | "lat" | "lng">,
): BerrymetCityLink | null {
  const overrideSlug = STATION_BERRYMET_CITY_SLUG[station.name];
  if (overrideSlug) {
    const city = cityBySlug(overrideSlug);
    if (!city || city.country !== berrymetCountryForStation(station)) return null;
    return {
      cityName: city.name,
      href: `${BERRYMET_BASE_URL}/l/${overrideSlug}`,
      distanceKm: distanceKm(station.lat, station.lng, city.lat, city.lng),
    };
  }

  const country = berrymetCountryForStation(station);
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

  const slug = slugByCityName.get(nearest.name);
  if (!slug) return null;

  return {
    cityName: nearest.name,
    href: `${BERRYMET_BASE_URL}/l/${slug}`,
    distanceKm: nearestDistance,
  };
}
