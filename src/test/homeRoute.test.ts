import { describe, expect, it } from "vitest";
import {
  homeScopeFromCountries,
  toggleCountrySelection,
} from "@/lib/countries";
import {
  buildHomePath,
  defaultHomePath,
  getHomeSitemapPaths,
  homePageCountForHomeScope,
  isHomePath,
  parseHomeCanonicalPath,
  resolveLegacyHomePath,
} from "@/lib/homeRoute";
import { getStationsForHomeScope } from "@/data/stationRegistry";
import { HOME_STATIONS_PAGE_SIZE } from "@/lib/paginate";

describe("country selection", () => {
  it("maps selected countries to home scope", () => {
    expect(homeScopeFromCountries(["pt"])).toBe("pt");
    expect(homeScopeFromCountries(["es"])).toBe("es");
    expect(homeScopeFromCountries(["pt", "es"])).toBe("all");
  });

  it("toggles countries without clearing the last selection", () => {
    expect(toggleCountrySelection(["pt", "es"], "pt")).toEqual(["es"]);
    expect(toggleCountrySelection(["es"], "pt")).toEqual(["pt", "es"]);
    expect(toggleCountrySelection(["pt"], "pt")).toEqual(["pt"]);
  });
});

describe("homeRoute", () => {
  it("defaultHomePath uses the configured default scope", () => {
    expect(defaultHomePath()).toBe("/all");
  });

  it("builds country and page paths", () => {
    expect(buildHomePath("all")).toBe("/all");
    expect(buildHomePath("pt")).toBe("/pt");
    expect(buildHomePath("pt", 3)).toBe("/pt/3");
    expect(buildHomePath("all", 2)).toBe("/all/2");
    expect(buildHomePath("es", 2)).toBe("/es/2");
    expect(buildHomePath("es", 1, new URLSearchParams("q=madrid"))).toBe("/es?q=madrid");
  });

  it("detects home paths", () => {
    expect(isHomePath("/all")).toBe(true);
    expect(isHomePath("/all/3")).toBe(true);
    expect(isHomePath("/pt")).toBe(true);
    expect(isHomePath("/pt/3")).toBe(true);
    expect(isHomePath("/es/2")).toBe(true);
    expect(isHomePath("/rankings")).toBe(false);
  });

  it("parses canonical home paths", () => {
    expect(parseHomeCanonicalPath("/all")).toEqual({ scope: "all", page: 1 });
    expect(parseHomeCanonicalPath("/pt")).toEqual({ scope: "pt", page: 1 });
    expect(parseHomeCanonicalPath("/es/2")).toEqual({ scope: "es", page: 2 });
    expect(parseHomeCanonicalPath("/rankings")).toBeNull();
  });

  it("resolves legacy query URLs", () => {
    expect(resolveLegacyHomePath(new URLSearchParams("country=es&page=2"))).toBe("/es/2");
    expect(resolveLegacyHomePath(new URLSearchParams("page=3"))).toBe("/all/3");
    expect(resolveLegacyHomePath(new URLSearchParams("country=es&q=madrid"))).toBe(
      "/es?q=madrid",
    );
  });

  it("lists every paginated home path in the sitemap", () => {
    const allPages = homePageCountForHomeScope("all");
    const ptPages = homePageCountForHomeScope("pt");
    const esPages = homePageCountForHomeScope("es");
    const paths = getHomeSitemapPaths();

    expect(allPages).toBe(
      Math.ceil(getStationsForHomeScope("all").length / HOME_STATIONS_PAGE_SIZE),
    );
    expect(ptPages).toBe(
      Math.ceil(getStationsForHomeScope("pt").length / HOME_STATIONS_PAGE_SIZE),
    );
    expect(esPages).toBe(
      Math.ceil(getStationsForHomeScope("es").length / HOME_STATIONS_PAGE_SIZE),
    );
    expect(paths).toContain("/all");
    expect(paths).toContain("/pt");
    expect(paths).toContain("/es");
    expect(paths).toHaveLength(allPages + ptPages + esPages);
  });
});
