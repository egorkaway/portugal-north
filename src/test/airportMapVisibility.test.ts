import { describe, expect, it } from "vitest";
import {
  emptyAirportMapVisibilityManifest,
  isAirportHiddenFromMap,
  recordAirportConnectionsEmpty,
  recordAirportConnectionsOk,
} from "../../server/lib/airportMapVisibility";

describe("airportMapVisibility", () => {
  it("hides an airport after the configured empty-period streak", () => {
    let manifest = emptyAirportMapVisibilityManifest(3);
    manifest = recordAirportConnectionsEmpty(manifest, "RGS", "2026-01-01");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(false);
    manifest = recordAirportConnectionsEmpty(manifest, "RGS", "2026-02-07");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(false);
    manifest = recordAirportConnectionsEmpty(manifest, "RGS", "2026-03-16");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(true);
    expect(manifest.airports.RGS?.consecutiveEmptyPeriods).toBe(3);
  });

  it("does not double-count the same period", () => {
    let manifest = emptyAirportMapVisibilityManifest(2);
    manifest = recordAirportConnectionsEmpty(manifest, "TEV", "2026-01-01");
    manifest = recordAirportConnectionsEmpty(manifest, "TEV", "2026-01-01");
    expect(manifest.airports.TEV?.consecutiveEmptyPeriods).toBe(1);
    expect(isAirportHiddenFromMap(manifest, "TEV")).toBe(false);
  });

  it("clears the streak and unhides after a successful bake", () => {
    let manifest = emptyAirportMapVisibilityManifest(2);
    manifest = recordAirportConnectionsEmpty(manifest, "ABC", "2026-01-01");
    manifest = recordAirportConnectionsEmpty(manifest, "ABC", "2026-02-07");
    expect(isAirportHiddenFromMap(manifest, "ABC")).toBe(true);
    manifest = recordAirportConnectionsOk(manifest, "ABC", "2026-03-16");
    expect(isAirportHiddenFromMap(manifest, "ABC")).toBe(false);
    expect(manifest.airports.ABC?.consecutiveEmptyPeriods).toBe(0);
  });
});
