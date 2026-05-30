import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { DISTANCE_SORT_STORAGE_KEY } from "@/lib/distanceSortStorage";

function mockLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  });
  return store;
}

describe("useUserLocation", () => {
  const getCurrentPosition = vi.fn();

  beforeEach(() => {
    getCurrentPosition.mockReset();
    mockLocalStorage();
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

  it("restores active sort after remount when preference was saved", async () => {
    getCurrentPosition.mockImplementation((ok) => {
      ok?.({
        coords: { latitude: 41.15, longitude: -8.61 },
      });
    });

    const first = renderHook(() => useUserLocation());

    act(() => {
      first.result.current.requestLocation();
    });

    await waitFor(() => {
      expect(first.result.current.state.status).toBe("ready");
    });

    first.unmount();

    const second = renderHook(() => useUserLocation());

    expect(second.result.current.isActive).toBe(true);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBe("1");

    await waitFor(() => {
      expect(second.result.current.state.status).toBe("ready");
    });

    expect(second.result.current.coords).toEqual({ lat: 41.15, lng: -8.61 });
  });

  it("clears saved preference when sort is turned off", async () => {
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

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBeNull();
  });
});
