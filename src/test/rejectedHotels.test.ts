import { describe, expect, it } from "vitest";
import {
  classifyBookingHotelPage,
  isBookingSearchUrl,
  isDirectBookingHotelUrl,
} from "../../scripts/lib/bookingLinkCheck.mjs";
import {
  isRejectedHotel,
  normHotelName,
  normalizeBookingUrl,
  normalizeRejectedHotels,
} from "../../scripts/lib/rejectedHotels.mjs";

describe("bookingLinkCheck", () => {
  it("detects direct hotel URLs", () => {
    expect(isDirectBookingHotelUrl("https://www.booking.com/hotel/pt/cardal.html")).toBe(true);
    expect(
      isDirectBookingHotelUrl(
        "https://www.booking.com/searchresults.html?ss=Porto&order=price",
      ),
    ).toBe(false);
  });

  it("detects search URLs", () => {
    expect(
      isBookingSearchUrl("https://www.booking.com/searchresults.html?ss=Porto&order=price"),
    ).toBe(true);
  });

  it("marks generic Booking titles as broken", () => {
    const result = classifyBookingHotelPage(
      "Booking.com Online Hotel Reservations",
      "Skip to main content",
      "https://www.booking.com/hotel/pt/missing.html",
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("generic_booking_title");

    const pt = classifyBookingHotelPage(
      "Booking.com reservas de hotéis on-line",
      "Skip to main content",
      "https://www.booking.com/hotel/pt/missing.html",
    );
    expect(pt.ok).toBe(false);
  });

  it("accepts descriptive property titles", () => {
    const result = classifyBookingHotelPage(
      "Cardal Hotel, Pombal (updated prices 2026)",
      "Check-in date",
      "https://www.booking.com/hotel/pt/cardal.html",
    );
    expect(result.ok).toBe(true);
  });
});

describe("rejectedHotels", () => {
  it("normalizes hotel names for matching", () => {
    expect(normHotelName("Residencial Marquês")).toBe("residencial marques");
  });

  it("blocks rejected hotels by station and name", () => {
    const data = normalizeRejectedHotels({
      entries: [
        {
          stationName: "Pombal",
          hotelName: "Residencial Marquês",
          normalizedName: "residencial marques",
          bookingUrl: "https://www.booking.com/hotel/pt/residencial-marques-pombal.html",
          reason: "generic_booking_title",
          rejectedAt: "2026-05-31T00:00:00.000Z",
        },
      ],
    });

    expect(
      isRejectedHotel(
        data,
        "Pombal",
        "Residencial Marquês",
        "https://www.booking.com/hotel/pt/residencial-marques-pombal.html?checkin=2026-06-01",
      ),
    ).toBe(true);
    expect(isRejectedHotel(data, "Pombal", "Cardal Hotel")).toBe(false);
  });

  it("normalizes booking URLs without query params", () => {
    expect(
      normalizeBookingUrl("https://www.booking.com/hotel/pt/cardal.html?aid=123"),
    ).toBe("https://www.booking.com/hotel/pt/cardal.html");
  });
});
