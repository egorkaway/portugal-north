import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  mergePinnedHotels,
  parseHotelMap,
  readPinnedHotelMap,
  townQueryForStation,
  writeHotelMap,
} from "../../scripts/lib/stationHotelFetch.mjs";
import {
  bookingStubHotels,
  hotelListNeedsFill,
} from "../../scripts/lib/expandStationAssets.mjs";

describe("stationHotelFetch", () => {
  it("keeps the rejected-hotel filter wired into OSM picks", () => {
    const src = readFileSync(join("scripts/lib/stationHotelFetch.mjs"), "utf8");
    expect(src).toMatch(/import \{ isRejectedHotel \} from "\.\/rejectedHotels\.mjs"/);
    expect(src).toMatch(/isRejectedHotel\(rejected, stationName, candidate\.name/);
  });

  it("treats Booking search stubs as an unfinished hotel list", () => {
    expect(hotelListNeedsFill(bookingStubHotels("Frankfurt Main Airport (FRA)", "de"))).toBe(true);
    expect(
      hotelListNeedsFill([
        {
          name: "Hilton Frankfurt Airport",
          distanceKm: 0.4,
          priceFrom: 38,
          bookingUrl: "https://www.booking.com/hotel/de/hilton-frankfurt-airport.html",
        },
      ]),
    ).toBe(false);
  });

  it("builds town geocode query from station name", () => {
    expect(townQueryForStation("Campanhã (Metro)")).toBe("Campanhã, Portugal");
    expect(townQueryForStation("Mafra")).toBe("Mafra, Portugal");
    expect(townQueryForStation("Vigo-Urzáiz", "es")).toBe("Vigo, Spain");
    expect(townQueryForStation("Charles de Gaulle International Airport (CDG)", "fr")).toBe(
      "Charles de Gaulle International, France",
    );
  });

  it("parses the pinned Luan Café Lanhelas listing", () => {
    const pinned = readPinnedHotelMap("src/data/hotels.ts");
    expect(pinned["Esqueiró"]).toEqual([
      {
        name: "Luan Café Lanhelas",
        distanceKm: 0.1,
        priceFrom: 30,
        bookingUrl: "https://www.booking.com/hotel/pt/luan-cafe-lanhelas.html",
      },
    ]);
  });

  it("reinserts pinned hotels when rewriting a station list that omitted them", () => {
    const pinned = readPinnedHotelMap("src/data/hotels.ts");
    const map = mergePinnedHotels(
      {
        Esqueiró: [
          {
            name: "Vila D'Artes",
            distanceKm: 2.4,
            priceFrom: 38,
            bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila",
          },
        ],
      },
      pinned,
    );
    expect(map["Esqueiró"].map((hotel) => hotel.name)).toEqual([
      "Luan Café Lanhelas",
      "Vila D'Artes",
    ]);

    const dir = mkdtempSync(join(tmpdir(), "hotels-"));
    writeFileSync(join(dir, "pinnedHotels.ts"), readFileSync("src/data/pinnedHotels.ts", "utf8"));
    const hotelsPath = join(dir, "hotels.ts");
    writeHotelMap(hotelsPath, { Pombal: [] }, [{ name: "Esqueiró" }, { name: "Pombal" }]);
    const parsed = parseHotelMap(readFileSync(hotelsPath, "utf8"));
    expect(parsed["Esqueiró"][0]?.name).toBe("Luan Café Lanhelas");
  });

  it("drops Cerveira pousada aliases when the HI listing is pinned", () => {
    const pinned = readPinnedHotelMap("src/data/hotels.ts");
    const map = mergePinnedHotels(
      {
        "Vila Nova de Cerveira": [
          {
            name: "Pousada de Vila Nova de Cerveira",
            distanceKm: 0.7,
            priceFrom: 25,
            bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-vila-nova-de-cerveira.html",
          },
          {
            name: "Minho Belo",
            distanceKm: 0.6,
            priceFrom: 38,
            bookingUrl: "https://www.booking.com/searchresults.html?ss=Minho",
          },
        ],
      },
      pinned,
    );
    expect(map["Vila Nova de Cerveira"].map((hotel) => hotel.name)).toEqual([
      "HI Vila Nova de Cerveira - Pousada de Juventude",
      "Minho Belo",
    ]);
  });
});
