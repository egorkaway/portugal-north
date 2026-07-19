import { describe, expect, it } from "vitest";
import { buildSitemapXml, getSitemapEntries } from "@/lib/sitemap";
import { allStations } from "@/data/stationRegistry";
import { getHomeSitemapPaths } from "@/lib/homeRoute";
import { getTrainLines } from "@/lib/trainLines";

describe("sitemap", () => {
  it("includes home pages, rankings, tickets, map, lines, privacy, and every station page", () => {
    const entries = getSitemapEntries();
    const homePages = getHomeSitemapPaths();
    expect(entries).toHaveLength(
      homePages.length + 5 + getTrainLines().length + allStations.length,
    );
    expect(entries[0].path).toBe("/all");
    expect(entries.some((e) => e.path === "/all/2")).toBe(true);
    expect(entries.some((e) => e.path === "/pt")).toBe(true);
    expect(entries.some((e) => e.path === "/es")).toBe(true);
    expect(entries.some((e) => e.path === "/es/2")).toBe(true);
    expect(entries.some((e) => e.path === "/rankings")).toBe(true);
    expect(entries.some((e) => e.path === "/tickets")).toBe(true);
    expect(entries.some((e) => e.path === "/privacy")).toBe(true);
    expect(entries.some((e) => e.path === "/map")).toBe(true);
    expect(entries.some((e) => e.path === "/lines")).toBe(true);
    expect(entries.some((e) => e.path === "/lines/linha-do-minho")).toBe(true);
    expect(entries.some((e) => e.path === "/stations/porto-campanha")).toBe(true);
    expect(entries.some((e) => e.path === "/stations/vigo-guixar")).toBe(true);
  });

  it("builds valid XML with absolute URLs", () => {
    const xml = buildSitemapXml("https://www.verystays.com");
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain("<loc>https://www.verystays.com/stations/aveiro</loc>");
    expect(xml).not.toContain("__SITE_URL__");
  });
});
