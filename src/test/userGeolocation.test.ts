import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { startUserGeolocation } from "@/lib/userGeolocation";

describe("startUserGeolocation", () => {
  const getCurrentPosition = vi.fn();
  const watchPosition = vi.fn();
  const clearWatch = vi.fn();

  beforeEach(() => {
    getCurrentPosition.mockReset();
    watchPosition.mockReset();
    clearWatch.mockReset();
    watchPosition.mockReturnValue(42);
    vi.stubGlobal("navigator", {
      geolocation: { getCurrentPosition, watchPosition, clearWatch },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves with the first successful fix from either API", () => {
    const onSuccess = vi.fn();
    const onFailure = vi.fn();

    getCurrentPosition.mockImplementation((ok) => {
      ok({ coords: { latitude: 40.21, longitude: -8.43 } });
    });
    watchPosition.mockImplementation(() => 42);

    startUserGeolocation({
      isCancelled: () => false,
      onSuccess,
      onFailure,
    });

    expect(onSuccess).toHaveBeenCalledWith({ lat: 40.21, lng: -8.43 });
    expect(onFailure).not.toHaveBeenCalled();
    expect(clearWatch).toHaveBeenCalledWith(42);
  });

  it("reports permission denial once", () => {
    const onSuccess = vi.fn();
    const onFailure = vi.fn();
    const denied = { code: 1, PERMISSION_DENIED: 1 };

    getCurrentPosition.mockImplementation((_ok, err) => err?.(denied));
    watchPosition.mockImplementation((_ok, err) => err?.(denied));

    startUserGeolocation({
      isCancelled: () => false,
      onSuccess,
      onFailure,
    });

    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledWith("denied");
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
