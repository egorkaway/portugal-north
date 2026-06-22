import { getHotelsForStation } from "@/lib/stationHotels";
import { getStationShareImageUrl } from "@/lib/stationImage";
import { stations } from "@/data/stations";
import {
  HOME_PAGE_META,
  NOT_FOUND_PAGE_META,
  RANKINGS_PAGE_META,
  getTicketsPageMeta,
  getMapPageMeta,
  getPrivacyPageMeta,
  buildSeoHeadHtml,
  buildStationPageMeta,
  type PageMeta,
} from "@/lib/pageMeta";

export { buildSeoHeadHtml };
import { stationToSlug } from "@/lib/stationSlug";

export type PrerenderRoute = {
  /** Path relative to dist/ (e.g. index.html, stations/porto/index.html). */
  outFile: string;
  meta: PageMeta;
};

export function getPrerenderRoutes(): PrerenderRoute[] {
  const routes: PrerenderRoute[] = [
    { outFile: "index.html", meta: HOME_PAGE_META },
    { outFile: "rankings/index.html", meta: RANKINGS_PAGE_META },
    { outFile: "tickets/index.html", meta: getTicketsPageMeta("en") },
    { outFile: "map/index.html", meta: getMapPageMeta("en") },
    { outFile: "privacy/index.html", meta: getPrivacyPageMeta("en") },
    { outFile: "404.html", meta: NOT_FOUND_PAGE_META },
  ];

  for (const station of stations) {
    const slug = stationToSlug(station.name);
    const hotels = getHotelsForStation(station.name);
    routes.push({
      outFile: `stations/${slug}/index.html`,
      meta: buildStationPageMeta(station, hotels, getStationShareImageUrl(station.name)),
    });
  }

  return routes;
}
