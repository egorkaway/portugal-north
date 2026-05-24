import { describe, expect, it } from "vitest";
import {
  buildBreadcrumbList,
  buildHomeStructuredData,
  buildStationStructuredData,
  jsonLdScript,
  votesToAggregateRating,
} from "../lib/structuredData";
import type { Station } from "../data/stations";

const aveiro: Station = {
  name: "Aveiro",
  lines: ["Linha do Norte"],
  types: ["Regional"],
  lat: 40.6443,
  lng: -8.6455,
};

describe("structuredData", () => {
  it("escapes script-breaking characters", () => {
    expect(jsonLdScript({ x: "<script>" })).not.toContain("<");
  });

  it("builds breadcrumb positions", () => {
    const crumb = buildBreadcrumbList([
      { name: "Home", path: "/" },
      { name: "Aveiro", path: "/stations/aveiro" },
    ]);
    const items = crumb.itemListElement as { position: number; name: string }[];
    expect(items[1].position).toBe(2);
    expect(items[1].name).toBe("Aveiro");
  });

  it("omits aggregate rating without enough votes", () => {
    expect(votesToAggregateRating(1, 0)).toBeNull();
    expect(votesToAggregateRating(3, 1)).not.toBeNull();
  });

  it("station graph includes TrainStation and hotels", () => {
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
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/example.jpg",
      stationRatings: { Aveiro: { up: 5, down: 1 } },
    });
    const graph = data["@graph"] as { "@type": string }[];
    const types = graph.map((n) => n["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("TrainStation");
    expect(types).toContain("LodgingBusiness");
  });

  it("home graph includes ItemList of stations", () => {
    const data = buildHomeStructuredData();
    const graph = data["@graph"] as { "@type": string; numberOfItems?: number }[];
    const list = graph.find((n) => n["@type"] === "ItemList");
    expect(list?.numberOfItems).toBeGreaterThan(100);
  });
});
