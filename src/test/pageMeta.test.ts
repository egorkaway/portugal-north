import { describe, expect, it } from "vitest";
import { buildSeoHeadHtml, buildStationPageMeta, HOME_PAGE_META } from "@/lib/pageMeta";
import { getPrerenderRoutes } from "@/lib/prerenderRoutes";
import { stations } from "@/data/stations";
import { getHotelsForStation } from "@/lib/stationHotels";

describe("buildSeoHeadHtml", () => {
  it("includes unique title and description in output", () => {
    const html = buildSeoHeadHtml(HOME_PAGE_META, "https://www.verystays.com");
    expect(html).toContain("<title>Portugal by Train: Stations &amp; Budget Hotels</title>");
    expect(html).toContain('rel="canonical" href="https://www.verystays.com/"');
  });
});

describe("getPrerenderRoutes", () => {
  it("generates one HTML file per station plus core pages", () => {
    const routes = getPrerenderRoutes();
    expect(routes.length).toBe(stations.length + 3);
    const porto = stations.find((s) => s.name === "Porto-Campanhã");
    expect(porto).toBeDefined();
    const meta = buildStationPageMeta(porto!, getHotelsForStation(porto!.name));
    expect(meta.title).toContain("Porto-Campanhã");
    expect(meta.description).not.toEqual(HOME_PAGE_META.description);
  });
});
