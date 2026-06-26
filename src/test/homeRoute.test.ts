import { describe, expect, it } from "vitest";
import { getStationsForCountry } from "@/data/stationRegistry";
import {
  buildHomePath,
  getHomeSitemapPaths,
  homePageCountForCountry,
  isHomePath,
  parseHomeCanonicalPath,
  parseHomePageParam,
  resolveLegacyHomePath,
} from "@/lib/homeRoute";
import { HOME_STATIONS_PAGE_SIZE } from "@/lib/paginate";

describe("homeRoute", () => {
  it("builds country and page paths", () => {
    expect(buildHomePath("pt")).toBe("/pt");
    expect(buildHomePath("pt", 3)).toBe("/pt/3");
    expect(buildHomePath("es", 2)).toBe("/es/2");
    expect(buildHomePath("es", 1, new URLSearchParams("q=madrid"))).toBe("/es?q=madrid");
  });

  it("detects home paths", () => {
    expect(isHomePath("/pt")).toBe(true);
    expect(isHomePath("/pt/3")).toBe(true);
    expect(isHomePath("/es/2")).toBe(true);
    expect(isHomePath("/rankings")).toBe(false);
  });

  it("parses canonical home paths", () => {
    expect(parseHomeCanonicalPath("/pt")).toEqual({ country: "pt", page: 1 });
    expect(parseHomeCanonicalPath("/es/2")).toEqual({ country: "es", page: 2 });
    expect(parseHomeCanonicalPath("/rankings")).toBeNull();
  });

  it("rejects invalid page params", () => {
    expect(parseHomePageParam("2")).toBe(2);
    expect(parseHomePageParam("0")).toBe(-1);
    expect(parseHomePageParam("abc")).toBe(-1);
  });

  it("resolves legacy query URLs", () => {
    expect(resolveLegacyHomePath(new URLSearchParams("country=es&page=2"))).toBe("/es/2");
    expect(resolveLegacyHomePath(new URLSearchParams("page=3"))).toBe("/pt/3");
    expect(resolveLegacyHomePath(new URLSearchParams("country=es&q=madrid"))).toBe(
      "/es?q=madrid",
    );
  });

  it("lists every paginated home path in the sitemap", () => {
    const ptPages = homePageCountForCountry("pt");
    const esPages = homePageCountForCountry("es");
    const paths = getHomeSitemapPaths();

    expect(ptPages).toBe(Math.ceil(getStationsForCountry("pt").length / HOME_STATIONS_PAGE_SIZE));
    expect(esPages).toBe(Math.ceil(getStationsForCountry("es").length / HOME_STATIONS_PAGE_SIZE));
    expect(paths).toContain("/pt");
    expect(paths).toContain("/pt/2");
    expect(paths).toContain("/es");
    expect(paths).toContain("/es/2");
    expect(paths).toHaveLength(ptPages + esPages);
  });
});
