import { getHotelsForStation } from "@/lib/stationHotels";
import { getStationShareImageUrl } from "@/lib/stationImage";
import { allStations } from "@/data/stationRegistry";
import {
  NOT_FOUND_PAGE_META,
  RANKINGS_PAGE_META,
  getHomePageMeta,
  getTicketsPageMeta,
  getMapPageMeta,
  getPrivacyPageMeta,
  buildSeoHeadHtml,
  buildStationPageMeta,
  type PageMeta,
} from "@/lib/pageMeta";

export { buildSeoHeadHtml };
import { stationToSlug } from "@/lib/stationSlug";
import { getHomeSitemapPaths, homePathToOutFile, parseHomeCanonicalPath } from "@/lib/homeRoute";

export type PrerenderRoute = {
  /** Path relative to dist/ (e.g. index.html, stations/porto/index.html). */
  outFile: string;
  meta: PageMeta;
};

export function getPrerenderRoutes(): PrerenderRoute[] {
  const routes: PrerenderRoute[] = [
    { outFile: "index.html", meta: getHomePageMeta("en", "pt") },
    { outFile: "rankings/index.html", meta: RANKINGS_PAGE_META },
    { outFile: "tickets/index.html", meta: getTicketsPageMeta("en") },
    { outFile: "map/index.html", meta: getMapPageMeta("en") },
    { outFile: "privacy/index.html", meta: getPrivacyPageMeta("en") },
    { outFile: "404.html", meta: NOT_FOUND_PAGE_META },
  ];

  for (const path of getHomeSitemapPaths()) {
    const parsed = parseHomeCanonicalPath(path);
    if (!parsed) continue;
    routes.push({
      outFile: homePathToOutFile(path),
      meta: getHomePageMeta("en", parsed.country, parsed.page),
    });
  }

  for (const station of allStations) {
    const slug = stationToSlug(station.name);
    const hotels = getHotelsForStation(station.name);
    routes.push({
      outFile: `stations/${slug}/index.html`,
      meta: buildStationPageMeta(station, hotels, getStationShareImageUrl(station.name)),
    });
  }

  return routes;
}
