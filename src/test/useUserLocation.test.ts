import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  DISTANCE_SORT_STORAGE_KEY,
  LAST_COORDS_STORAGE_KEY,
} from "@/lib/distanceSortStorage";

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

function mockGeolocation() {
  const getCurrentPosition = vi.fn();
  const watchPosition = vi.fn();
  const clearWatch = vi.fn();

  vi.stubGlobal("navigator", {
    geolocation: { getCurrentPosition, watchPosition, clearWatch },
  });

  return { getCurrentPosition, watchPosition, clearWatch };
}

function mockPosition(lat: number, lng: number) {
  return { coords: { latitude: lat, longitude: lng } };
}

describe("useUserLocation", () => {
  beforeEach(() => {
    mockLocalStorage();
    mockGeolocation();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stays active after permission denied (no flicker off)", async () => {
    const { getCurrentPosition, watchPosition } = mockGeolocation();
    const fail = (_ok: unknown, err?: (error: { code: number; PERMISSION_DENIED: number }) => void) => {
      err?.({ code: 1, PERMISSION_DENIED: 1 });
    };
    getCurrentPosition.mockImplementation(fail);
    watchPosition.mockImplementation(fail);

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

  it("turns off after permission denied when tapped again", async () => {
    const { getCurrentPosition, watchPosition } = mockGeolocation();
    const fail = (_ok: unknown, err?: (error: { code: number; PERMISSION_DENIED: number }) => void) => {
      err?.({ code: 1, PERMISSION_DENIED: 1 });
    };
    getCurrentPosition.mockImplementation(fail);
    watchPosition.mockImplementation(fail);

    const { result } = renderHook(() => useUserLocation());

    act(() => {
      result.current.requestLocation();
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe("denied");
    });

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.state.status).toBe("idle");
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBeNull();
  });

  it("turns off while location is loading", () => {
    const { getCurrentPosition, watchPosition } = mockGeolocation();
    getCurrentPosition.mockImplementation(() => {});
    watchPosition.mockReturnValue(1);

    const { result } = renderHook(() => useUserLocation());

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.state.status).toBe("loading");

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.state.status).toBe("idle");
  });

  it("keeps coords and active state after success", async () => {
    const { getCurrentPosition, watchPosition } = mockGeolocation();
    const succeed = (ok?: (position: ReturnType<typeof mockPosition>) => void) => {
      ok?.(mockPosition(41.15, -8.61));
    };
    getCurrentPosition.mockImplementation(succeed);
    watchPosition.mockImplementation(succeed);

    const { result } = renderHook(() => useUserLocation());

    act(() => {
      result.current.requestLocation();
    });

    await waitFor(() => {
      expect(result.current.coords).toEqual({ lat: 41.15, lng: -8.61 });
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.state.status).toBe("idle");
    expect(localStorage.getItem(LAST_COORDS_STORAGE_KEY)).toContain("41.15");
  });

  it("restores coords after remount when preference was saved", async () => {
    const { getCurrentPosition, watchPosition } = mockGeolocation();
    const succeed = (ok?: (position: ReturnType<typeof mockPosition>) => void) => {
      ok?.(mockPosition(41.15, -8.61));
    };
    getCurrentPosition.mockImplementation(succeed);
    watchPosition.mockImplementation(succeed);

    const first = renderHook(() => useUserLocation());

    act(() => {
      first.result.current.requestLocation();
    });

    await waitFor(() => {
      expect(first.result.current.coords).toEqual({ lat: 41.15, lng: -8.61 });
    });

    first.unmount();

    const second = renderHook(() => useUserLocation());

    expect(second.result.current.isActive).toBe(true);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBe("1");
    expect(second.result.current.coords).toEqual({ lat: 41.15, lng: -8.61 });
  });

  it("clears saved preference when sort is turned off", async () => {
    const { getCurrentPosition, watchPosition } = mockGeolocation();
    const succeed = (ok?: (position: ReturnType<typeof mockPosition>) => void) => {
      ok?.(mockPosition(41.15, -8.61));
    };
    getCurrentPosition.mockImplementation(succeed);
    watchPosition.mockImplementation(succeed);

    const { result } = renderHook(() => useUserLocation());

    act(() => {
      result.current.requestLocation();
    });

    await waitFor(() => {
      expect(result.current.coords).toEqual({ lat: 41.15, lng: -8.61 });
    });

    act(() => {
      result.current.requestLocation();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.coords).toBeNull();
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(LAST_COORDS_STORAGE_KEY)).toBeNull();
  });
});
