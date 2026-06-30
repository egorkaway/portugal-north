import { describe, expect, it } from "vitest";
import { buildSeoHeadHtml, buildStationPageMeta, getHomePageMeta } from "@/lib/pageMeta";
import { getPrerenderRoutes } from "@/lib/prerenderRoutes";
import { allStations } from "@/data/stationRegistry";
import { getHomeSitemapPaths } from "@/lib/homeRoute";
import { portugalStations } from "@/data/stations";
import { getHotelsForStation } from "@/lib/stationHotels";

describe("buildSeoHeadHtml", () => {
  it("includes unique title and description in output", () => {
    const html = buildSeoHeadHtml(getHomePageMeta("en", "pt"), "https://www.verystays.com");
    expect(html).toContain("<title>Sustainable Iberian: Stations &amp; Budget Hotels</title>");
    expect(html).toContain('rel="canonical" href="https://www.verystays.com/pt"');
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
    const homeExtra = getHomeSitemapPaths().length;
    expect(routes.length).toBe(allStations.length + 7 + homeExtra);
    const porto = portugalStations.find((s) => s.name === "Porto-Campanhã");
    expect(porto).toBeDefined();
    const meta = buildStationPageMeta(porto!, getHotelsForStation(porto!.name));
    expect(meta.title).toContain("Porto-Campanhã");
    expect(meta.description).not.toEqual(getHomePageMeta("en", "pt").description);
  });
});
