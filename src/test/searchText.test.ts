import { describe, expect, it } from "vitest";
import { foldSearchText, stationMatchesSearch, textIncludesSearch } from "@/lib/searchText";
import { stations } from "@/data/stations";

describe("foldSearchText", () => {
  it("strips Portuguese diacritics", () => {
    expect(foldSearchText("Valença")).toBe("valenca");
    expect(foldSearchText("São Bento (Porto)")).toBe("sao bento (porto)");
    expect(foldSearchText("Póvoa de Varzim")).toBe("povoa de varzim");
  });
});

describe("stationMatchesSearch", () => {
  it("matches Valença when query omits cedilla", () => {
    const valenca = stations.find((s) => s.name === "Valença");
    expect(valenca).toBeDefined();
    expect(stationMatchesSearch(valenca!, "Valenca")).toBe(true);
    expect(stationMatchesSearch(valenca!, "valenc")).toBe(true);
  });

  it("matches accented station names from ASCII queries", () => {
    expect(stationMatchesSearch({ name: "Coimbra-B", lines: [] }, "coimbra")).toBe(true);
    expect(
      stationMatchesSearch({ name: "São Bento (Porto)", lines: ["Linha do Minho"] }, "sao bento"),
    ).toBe(true);
  });

  it("matches line names without accents", () => {
    expect(
      textIncludesSearch("Linha do Minho", "minho"),
    ).toBe(true);
  });
});
