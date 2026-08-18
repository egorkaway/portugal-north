import { describe, expect, it } from "vitest";
import { hotelVoteKey, getTopDownvotedHotels, getTopUpvotedHotels, parseHotelVoteKey } from "@/lib/rankHotels";

describe("rankHotels", () => {
  it("parses hotel vote keys", () => {
    expect(parseHotelVoteKey("Aveiro::Hotel das Salinas")).toEqual({
      stationName: "Aveiro",
      hotelName: "Hotel das Salinas",
    });
  });

  it("maps Cerveira pousada aliases onto the Booking HI vote key", () => {
    expect(hotelVoteKey("Vila Nova de Cerveira", "Pousada de Vila Nova de Cerveira")).toBe(
      "Vila Nova de Cerveira::HI Vila Nova de Cerveira - Pousada de Juventude",
    );
    expect(
      hotelVoteKey("Vila Nova de Cerveira", "Pousada de Juventude Vila Nova de Cerveira"),
    ).toBe("Vila Nova de Cerveira::HI Vila Nova de Cerveira - Pousada de Juventude");
  });

  it("ranks hotels nationally by upvotes", () => {
    const ranked = getTopUpvotedHotels({
      "Aveiro::Hotel A": { up: 2, down: 0 },
      "Porto-Campanhã::Hotel B": { up: 5, down: 1 },
      "Faro::Hotel C": { up: 5, down: 0 },
      "Braga::Hotel D": { up: 4, down: 0 },
      "Coimbra::Hotel E": { up: 3, down: 0 },
      "Guarda::Hotel F": { up: 1, down: 0 },
      "Beja::Hotel G": { up: 1, down: 1 },
    });

    expect(ranked.map((h) => h.hotelName)).toEqual([
      "Hotel C",
      "Hotel B",
      "Hotel D",
      "Hotel E",
      "Hotel A",
    ]);
    expect(ranked[0].stationName).toBe("Faro");
  });

  it("ranks hotels nationally by downvotes", () => {
    const ranked = getTopDownvotedHotels({
      "Aveiro::Hotel A": { up: 0, down: 4 },
      "Porto-Campanhã::Hotel B": { up: 1, down: 2 },
      "Faro::Hotel C": { up: 0, down: 7 },
      "Braga::Hotel D": { up: 0, down: 5 },
      "Coimbra::Hotel E": { up: 0, down: 3 },
      "Guarda::Hotel F": { up: 0, down: 1 },
      "London City Airport (LCY)::Hotel G": { up: 0, down: 99 },
    });

    expect(ranked.map((h) => h.hotelName)).toEqual([
      "Hotel C",
      "Hotel D",
      "Hotel A",
      "Hotel E",
      "Hotel B",
    ]);
  });

  it("merges duplicate Cerveira pousada vote keys onto the catalog name", () => {
    const ranked = getTopUpvotedHotels({
      "Vila Nova de Cerveira::Pousada de Juventude Vila Nova de Cerveira": { up: 1, down: 0 },
      "Vila Nova de Cerveira::Pousada de Vila Nova de Cerveira": { up: 1, down: 0 },
      "Aveiro::Hotel A": { up: 1, down: 0 },
    });

    const cerveira = ranked.find((h) => h.stationName === "Vila Nova de Cerveira");
    expect(cerveira).toEqual({
      id: "Vila Nova de Cerveira::HI Vila Nova de Cerveira - Pousada de Juventude",
      hotelName: "HI Vila Nova de Cerveira - Pousada de Juventude",
      stationName: "Vila Nova de Cerveira",
      up: 2,
      down: 0,
    });
    expect(ranked.filter((h) => h.stationName === "Vila Nova de Cerveira")).toHaveLength(1);
  });
});
