import { stationHotels } from "@/data/hotels";
import { stationImages } from "@/data/stationImages";
import { stations } from "@/data/stations";
import {
  HOME_PAGE_META,
  NOT_FOUND_PAGE_META,
  RANKINGS_PAGE_META,
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
    { outFile: "404.html", meta: NOT_FOUND_PAGE_META },
  ];

  for (const station of stations) {
    const slug = stationToSlug(station.name);
    const hotels = stationHotels[station.name] ?? [];
    const imageUrl = stationImages[station.name];
    routes.push({
      outFile: `stations/${slug}/index.html`,
      meta: buildStationPageMeta(station, hotels, imageUrl),
    });
  }

  return routes;
}
