import { describe, expect, it } from "vitest";
import type { Hotel } from "@/data/hotels";
import { getHotelsForStation, isPlaceholderHotel } from "@/lib/stationHotels";

describe("isPlaceholderHotel", () => {
  it("matches generic near-station labels", () => {
    expect(
      isPlaceholderHotel({
        name: "Hotels near São Pedro da Torre",
        distanceKm: 1,
        priceFrom: 30,
        bookingUrl: "https://example.com",
      }),
    ).toBe(true);
    expect(
      isPlaceholderHotel({
        name: "Guest houses near Porto",
        distanceKm: 1,
        priceFrom: 30,
        bookingUrl: "https://example.com",
      }),
    ).toBe(true);
  });

  it("does not match real hotel names", () => {
    expect(
      isPlaceholderHotel({
        name: "Mystay Porto São Bento",
        distanceKm: 0.1,
        priceFrom: 45,
        bookingUrl: "https://www.booking.com/hotel/pt/mystay.html",
      }),
    ).toBe(false);
  });
});

describe("getHotelsForStation", () => {
  it("returns real hotels for Porto-Campanhã", () => {
    const hotels = getHotelsForStation("Porto-Campanhã");
    expect(hotels.length).toBeGreaterThan(0);
    expect(hotels.every((h: Hotel) => !isPlaceholderHotel(h))).toBe(true);
  });

  it("returns empty list when only placeholders exist", () => {
    expect(getHotelsForStation("Soalheira")).toEqual([]);
  });

  it("keeps the pinned Luan Café Lanhelas listing on Esqueiró", () => {
    const hotels = getHotelsForStation("Esqueiró");
    expect(hotels[0]).toMatchObject({
      name: "Luan Café Lanhelas",
      bookingUrl: "https://www.booking.com/hotel/pt/luan-cafe-lanhelas.html",
    });
    expect(getHotelsForStation("Esqueiro")[0]?.name).toBe("Luan Café Lanhelas");
  });

  it("pins Hotel Lino on the nearest Vigo station", () => {
    const hotels = getHotelsForStation("Vigo-Urzáiz");
    expect(hotels[0]).toMatchObject({
      name: "Hotel Lino",
      distanceKm: 0.2,
      bookingUrl: "https://www.booking.com/hotel/es/lino.html",
    });
    expect(getHotelsForStation("Vigo-Guixar").map((hotel) => hotel.name)).not.toContain("Hotel Lino");
  });

  it("shows one Cerveira pousada under the Hostelling International name", () => {
    const names = getHotelsForStation("Vila Nova de Cerveira").map((hotel) => hotel.name);
    expect(names).toContain("HI Vila Nova de Cerveira - Pousada de Juventude");
    expect(names.filter((name) => /cerveira/i.test(name) && /pousada|juventude/i.test(name))).toEqual([
      "HI Vila Nova de Cerveira - Pousada de Juventude",
    ]);
  });
});
