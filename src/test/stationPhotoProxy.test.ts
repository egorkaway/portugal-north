import { describe, expect, it } from "vitest";
import { resolveStationPhotoUrl } from "../../server/lib/stationPhotoProxy";

describe("resolveStationPhotoUrl", () => {
  it("allows Wikimedia Commons thumbs", () => {
    const url = resolveStationPhotoUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Aveiro.jpg/960px-Aveiro.jpg",
    );
    expect(url?.hostname).toBe("upload.wikimedia.org");
  });

  it("rejects other hosts", () => {
    expect(resolveStationPhotoUrl("https://evil.example/x.jpg")).toBeNull();
    expect(resolveStationPhotoUrl("https://images.pexels.com/photos/1.jpeg")).toBeNull();
  });

  it("rejects non-https and junk", () => {
    expect(resolveStationPhotoUrl("http://upload.wikimedia.org/a.jpg")).toBeNull();
    expect(resolveStationPhotoUrl("not-a-url")).toBeNull();
    expect(resolveStationPhotoUrl("")).toBeNull();
  });
});
