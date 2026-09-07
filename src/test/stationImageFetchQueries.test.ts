import { describe, expect, it } from "vitest";
import {
  buildPexelsQueries,
  isNonPhotographicWikiAsset,
  locationNamesFromStation,
  metroSystemForStation,
  stationBaseName,
  wikiLangsForStation,
  wikiTitlesForStation,
} from "../../scripts/lib/stationImageFetch.mjs";

describe("station image query helpers", () => {
  it("strips (Metro) from the searchable base name", () => {
    expect(stationBaseName("Trindade (Metro)")).toBe("Trindade");
    expect(stationBaseName("Campanhã (Metro)")).toBe("Campanhã");
    expect(stationBaseName("Senhora da Hora")).toBe("Senhora da Hora");
  });

  it("classifies Porto metro stops and avoids 'Metro' as the locality", () => {
    const trindade = {
      name: "Trindade (Metro)",
      lines: ["Metro Linha E (Roxa)"],
      lat: 41.1515,
      lng: -8.6095,
      country: "pt",
    };
    expect(metroSystemForStation(trindade)).toBe("porto");
    expect(locationNamesFromStation(trindade)).not.toContain("Metro");
    const queries = buildPexelsQueries(trindade);
    expect(queries[0]).toMatch(/Trindade/i);
    expect(queries.some((q) => /Metro do Porto/i.test(q))).toBe(true);
    expect(queries.some((q) => /^Metro train station Portugal$/i.test(q))).toBe(false);
  });

  it("prefers Metro do Porto Wikipedia titles", () => {
    const titles = wikiTitlesForStation({
      name: "Estádio do Dragão",
      lines: ["Metro Linha A (Azul)"],
      lat: 41.1618,
      lng: -8.5837,
      country: "pt",
    });
    expect(titles[0]).toBe("Estação Estádio do Dragão (Metro do Porto)");
  });

  it("uses English Wikipedia airport titles instead of Portuguese stations", () => {
    const cdg = {
      name: "Charles de Gaulle International Airport (CDG)",
      lines: ["CDG"],
      lat: 49.01,
      lng: 2.55,
      country: "fr",
    };
    expect(stationBaseName(cdg.name)).toBe("Charles de Gaulle International Airport");
    expect(wikiTitlesForStation(cdg)).toContain("Charles de Gaulle Airport");
    expect(wikiTitlesForStation(cdg)).toContain("Aéroport de Paris-Charles-de-Gaulle");
    expect(wikiLangsForStation(cdg)).toEqual(["en", "fr"]);
    expect(buildPexelsQueries(cdg)[0]).toMatch(/airport/i);
  });

  it("rejects Wikipedia logos and SVG diagrams as hero photos", () => {
    expect(
      isNonPhotographicWikiAsset(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Paris_Aéroport_logo.svg/960px-Paris_Aéroport_logo.svg.png",
      ),
    ).toBe(true);
    expect(isNonPhotographicWikiAsset("Paris_Aéroport_logo.svg")).toBe(true);
    expect(isNonPhotographicWikiAsset("File:Airplane silhouette.svg")).toBe(true);
    expect(isNonPhotographicWikiAsset("File:Charles De Gaulle Airport.jpg")).toBe(false);
    expect(isNonPhotographicWikiAsset("File:CDG-aerialview.jpg")).toBe(false);
  });
});
