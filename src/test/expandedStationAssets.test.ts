import { describe, expect, it } from "vitest";
import { stationHotels } from "@/data/hotels";
import { stationImages } from "@/data/stationImages";
import { hasRepresentativeStationImage } from "@/lib/stationImage";
import {
  findDuplicateGroups,
  imageOccupationKeys,
} from "../../scripts/lib/stationImageFetch.mjs";

/** Cascais + Sado + Coimbra suburban batch added in one go, plus gradual CP expands. */
const RECENT_PORTUGAL_STATIONS = [
  "São João do Estoril",
  "São Pedro do Estoril",
  "Venda do Alcaide",
  "Praias do Sado-A",
  "Formoselha – Santo Varão",
  "Pereira",
  "Bencanta",
  "Espadaneira",
  "Ameal",
  "Casais",
  "Vila Pouca do Campo",
];

describe("expanded station assets", () => {
  it("gives each recent Portugal add a representative unique image", () => {
    const missing = RECENT_PORTUGAL_STATIONS.filter((name) => !hasRepresentativeStationImage(name));
    expect(missing, `missing images: ${missing.join(", ")}`).toEqual([]);

    const occupied = new Map();
    for (const [name, url] of Object.entries(stationImages)) {
      for (const key of imageOccupationKeys(url)) {
        const owners = occupied.get(key) ?? [];
        owners.push(name);
        occupied.set(key, owners);
      }
    }
    const clashes = RECENT_PORTUGAL_STATIONS.flatMap((name) => {
      const url = stationImages[name];
      return imageOccupationKeys(url)
        .map((key) => occupied.get(key) ?? [])
        .filter((owners) => owners.length > 1)
        .map((owners) => `${name} shares ${owners.join(", ")}`);
    });
    expect(clashes).toEqual([]);
    expect(
      findDuplicateGroups(stationImages).flatMap(([, names]) => names).filter((name) =>
        RECENT_PORTUGAL_STATIONS.includes(name),
      ),
    ).toEqual([]);
  });

  it("stores a hotel lookup attempt for each recent Portugal add", () => {
    const missing = RECENT_PORTUGAL_STATIONS.filter(
      (name) => (stationHotels[name]?.length ?? 0) < 3,
    );
    expect(missing, `missing hotel listings: ${missing.join(", ")}`).toEqual([]);
  });
});
