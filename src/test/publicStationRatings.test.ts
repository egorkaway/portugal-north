import { describe, expect, it } from "vitest";
import { pickPublicHotelRatings, pickPublicStationRatings } from "@/lib/publicStationRatings";

describe("publicStationRatings", () => {
  it("drops Europe destination airports from station rankings", () => {
    const filtered = pickPublicStationRatings({
      Aveiro: { up: 3, down: 1 },
      "London Stansted Airport (STN)": { up: 0, down: 4 },
      "London City Airport (LCY)": { up: 0, down: 2 },
    });

    expect(filtered).toEqual({
      Aveiro: { up: 3, down: 1 },
    });
  });

  it("drops hotel votes tied to non-public stations", () => {
    const filtered = pickPublicHotelRatings({
      "Aveiro::Hotel A": { up: 2, down: 0 },
      "London Stansted Airport (STN)::Airport Hotel": { up: 0, down: 1 },
    });

    expect(filtered).toEqual({
      "Aveiro::Hotel A": { up: 2, down: 0 },
    });
  });

  it("merges aliased Cerveira pousada keys after filtering", () => {
    const filtered = pickPublicHotelRatings({
      "Vila Nova de Cerveira::Pousada de Juventude Vila Nova de Cerveira": { up: 1, down: 0 },
      "Vila Nova de Cerveira::Pousada de Vila Nova de Cerveira": { up: 1, down: 0 },
      "London Stansted Airport (STN)::Airport Hotel": { up: 0, down: 1 },
    });

    expect(filtered).toEqual({
      "Vila Nova de Cerveira::HI Vila Nova de Cerveira - Pousada de Juventude": { up: 2, down: 0 },
    });
  });
});
