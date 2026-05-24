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
    expect(getHotelsForStation("São Pedro da Torre")).toEqual([]);
  });
});
