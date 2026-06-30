import { describe, expect, it } from "vitest";
import {
  buildBreadcrumbList,
  buildHomeStructuredData,
  buildStationStructuredData,
  jsonLdScript,
} from "../lib/structuredData";
import { stationImages } from "../data/stationImages";
import { DEFAULT_SITE_URL } from "../lib/site";
import type { Station } from "../data/stations";

type ImageObjectNode = {
  "@type": string;
  contentUrl?: string;
  creator?: { "@type": string; name: string };
  creditText?: string;
  copyrightNotice?: string;
  license?: string;
};

function trainStationImage(data: ReturnType<typeof buildStationStructuredData>): ImageObjectNode {
  const graph = data["@graph"] as { "@type": string; image?: ImageObjectNode }[];
  const station = graph.find((n) => n["@type"] === "TrainStation");
  return station?.image as ImageObjectNode;
}

const PRODUCTION_ORIGIN = DEFAULT_SITE_URL;

const aveiro: Station = {
  name: "Aveiro",
  lines: ["Linha do Norte"],
  types: ["Regional"],
  lat: 40.6443,
  lng: -8.6455,
  country: "pt",
};

describe("structuredData", () => {
  it("escapes script-breaking characters", () => {
    expect(jsonLdScript({ x: "<script>" })).not.toContain("<");
  });

  it("builds breadcrumb positions with absolute item URLs", () => {
    const crumb = buildBreadcrumbList([
      { name: "Home", path: "/" },
      { name: "Aveiro", path: "/stations/aveiro" },
    ]);
    const items = crumb.itemListElement as {
      position: number;
      name: string;
      item?: string;
    }[];
    expect(items[0].item).toBe(`${PRODUCTION_ORIGIN}/pt`);
    expect(items[1].position).toBe(2);
    expect(items[1].name).toBe("Aveiro");
    expect(items[1].item).toBeUndefined();
    expect(crumb["@id"]).toBe(`${PRODUCTION_ORIGIN}/stations/aveiro#breadcrumb`);
    for (const entry of items) {
      if (entry.item) {
        expect(entry.item).toMatch(/^https:\/\//);
        expect(entry.item).not.toMatch(/undefined/);
      }
    }
  });

  it("station graph includes TrainStation and hotels without review markup", () => {
    const data = buildStationStructuredData({
      station: aveiro,
      slug: "aveiro",
      hotels: [
        {
          name: "Hotel das Salinas",
          distanceKm: 0.5,
          priceFrom: 30,
          bookingUrl: "https://www.booking.com/example",
        },
      ],
      imageUrl: stationImages.Aveiro,
    });
    const graph = data["@graph"] as { "@type": string; aggregateRating?: unknown }[];
    const types = graph.map((n) => n["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("TrainStation");
    expect(types).toContain("LodgingBusiness");

    const trainStation = graph.find((n) => n["@type"] === "TrainStation");
    expect(trainStation?.aggregateRating).toBeUndefined();

    const hotel = graph.find((n) => n["@type"] === "LodgingBusiness");
    expect(hotel?.aggregateRating).toBeUndefined();

    const breadcrumb = graph.find((n) => n["@type"] === "BreadcrumbList") as {
      itemListElement: { item?: string }[];
    };
    expect(breadcrumb.itemListElement[0].item).toBe(`${PRODUCTION_ORIGIN}/pt`);
    expect(breadcrumb.itemListElement[1].item).toBeUndefined();
  });

  it("station ImageObject includes Google image metadata fields", () => {
    const wikimedia = buildStationStructuredData({
      station: aveiro,
      slug: "aveiro",
      hotels: [],
      imageUrl: stationImages.Aveiro,
    });
    const wikiImage = trainStationImage(wikimedia);
    expect(wikiImage.creator).toEqual({ "@type": "Person", name: "nmorao" });
    expect(wikiImage.creditText).toContain("Wikimedia Commons");
    expect(wikiImage.copyrightNotice).toContain("CC BY-SA");
    expect(wikiImage.license).toBe("https://creativecommons.org/licenses/by-sa/4.0/");

    const pexelsUrl =
      "https://images.pexels.com/photos/953125/pexels-photo-953125.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";
    const pexels = buildStationStructuredData({
      station: { ...aveiro, name: "Agualva - Cacém" },
      slug: "agualva-cacem",
      hotels: [],
      imageUrl: pexelsUrl,
    });
    const pexelsImage = trainStationImage(pexels);
    expect(pexelsImage.creator).toEqual({ "@type": "Person", name: "Francesco Paggiaro" });
    expect(pexelsImage.creditText).toBe("Francesco Paggiaro on Pexels");
    expect(pexelsImage.copyrightNotice).toContain("Pexels License");
    expect(pexelsImage.license).toBe("https://www.pexels.com/license/");
  });

  it("home organization logo includes image metadata fields", () => {
    const data = buildHomeStructuredData();
    const graph = data["@graph"] as { "@type": string; logo?: ImageObjectNode }[];
    const org = graph.find((n) => n["@type"] === "Organization");
    expect(org?.logo?.creator?.name).toBe("Sustainable Iberian");
    expect(org?.logo?.creditText).toBe("Sustainable Iberian");
    expect(org?.logo?.copyrightNotice).toContain("Sustainable Iberian");
  });

  it("home graph includes ItemList of stations", () => {
    const data = buildHomeStructuredData();
    const graph = data["@graph"] as { "@type": string; numberOfItems?: number }[];
    const list = graph.find((n) => n["@type"] === "ItemList");
    expect(list?.numberOfItems).toBeGreaterThan(100);
  });
});
