import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserLocation } from "@/hooks/useUserLocation";

describe("useUserLocation", () => {
  const getCurrentPosition = vi.fn();

  beforeEach(() => {
    getCurrentPosition.mockReset();
    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stays active after permission denied (no flicker off)", async () => {
    getCurrentPosition.mockImplementation((_ok, err) => {
      err?.({ code: 1, PERMISSION_DENIED: 1 });
    });

    const { result } = renderHook(() => useUserLocation());

    act(() => {
      result.current.requestLocation();
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe("denied");
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.coords).toBeNull();
  });

  it("keeps coords and active state after success", async () => {
    getCurrentPosition.mockImplementation((ok) => {
      ok?.({
        coords: { latitude: 41.15, longitude: -8.61 },
      });
    });

    const { result } = renderHook(() => useUserLocation());

    act(() => {
      result.current.requestLocation();
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe("ready");
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.coords).toEqual({ lat: 41.15, lng: -8.61 });
  });
});
