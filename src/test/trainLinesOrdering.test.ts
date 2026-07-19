import { describe, expect, it } from "vitest";
import { getTrainLineBySlug } from "@/lib/trainLines";

describe("train line station ordering", () => {
  it("lists Linha do Minho from north (Valença) down to Porto", () => {
    const line = getTrainLineBySlug("linha-do-minho");
    expect(line).toBeDefined();
    const names = line!.stations.map((s) => s.name);
    expect(names.length).toBeGreaterThan(2);

    // North-first: latitudes must be non-increasing down the list.
    for (let i = 1; i < line!.stations.length; i += 1) {
      expect(line!.stations[i].lat).toBeLessThanOrEqual(line!.stations[i - 1].lat);
    }

    // Porto is the southern terminus, so it belongs near the bottom.
    const portoIndex = names.findIndex((n) => /porto/i.test(n));
    expect(portoIndex).toBeGreaterThan(-1);
    expect(portoIndex).toBeGreaterThan(line!.stations.length / 2);
  });
});
