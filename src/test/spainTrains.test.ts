import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSpainTrains } from "@/lib/spainTrains";

describe("fetchSpainTrains", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns trains when the live overlay is up", async () => {
    vi.stubGlobal("AbortSignal", { ...AbortSignal, timeout: () => undefined });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          fetchedAt: "2026-08-18T21:00:00.000Z",
          trainCount: 1,
          trains: [{ id: "cercanias:1", lat: 40.4, lng: -3.7, label: "C2", line: "C2", kind: "cercanias", status: null }],
        }),
      }),
    );

    const result = await fetchSpainTrains();
    expect(result.trainCount).toBe(1);
    expect(result.trains).toHaveLength(1);
  });

  it("returns an empty overlay when Renfe times out or the API errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("The operation was aborted due to timeout", "TimeoutError")));
    await expect(fetchSpainTrains()).resolves.toEqual({
      fetchedAt: "",
      trainCount: 0,
      trains: [],
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: "renfe_unavailable", trains: [] }),
      }),
    );
    await expect(fetchSpainTrains()).resolves.toEqual({
      fetchedAt: "",
      trainCount: 0,
      trains: [],
    });
  });
});
