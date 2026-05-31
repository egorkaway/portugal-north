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

  it("does not HTML-escape ampersands in og/twitter image URLs", () => {
    const pexelsUrl =
      "https://images.pexels.com/photos/953125/pexels-photo-953125.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";
    const html = buildSeoHeadHtml(
      {
        title: "Test",
        description: "Test",
        canonicalPath: "/stations/test/",
        ogImagePath: pexelsUrl,
      },
      "https://www.verystays.com",
    );
    expect(html).toContain(`content="${pexelsUrl}"`);
    expect(html).not.toContain("&amp;cs=tinysrgb");
  });
});

describe("getPrerenderRoutes", () => {
  it("generates one HTML file per station plus core pages", () => {
    const routes = getPrerenderRoutes();
    expect(routes.length).toBe(stations.length + 5);
    const porto = stations.find((s) => s.name === "Porto-Campanhã");
    expect(porto).toBeDefined();
    const meta = buildStationPageMeta(porto!, getHotelsForStation(porto!.name));
    expect(meta.title).toContain("Porto-Campanhã");
    expect(meta.description).not.toEqual(HOME_PAGE_META.description);
  });
});
