import { describe, expect, it } from "vitest";
import { buildSitemapXml, getSitemapEntries } from "@/lib/sitemap";
import { allStations } from "@/data/stationRegistry";

describe("sitemap", () => {
  it("includes home, rankings, tickets, map, privacy, and every station page", () => {
    const entries = getSitemapEntries();
    expect(entries).toHaveLength(5 + allStations.length);
    expect(entries[0].path).toBe("/");
    expect(entries[1].path).toBe("/rankings");
    expect(entries.some((e) => e.path === "/tickets")).toBe(true);
    expect(entries.some((e) => e.path === "/privacy")).toBe(true);
    expect(entries.some((e) => e.path === "/map")).toBe(true);
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
