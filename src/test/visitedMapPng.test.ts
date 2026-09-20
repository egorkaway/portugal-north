import { afterEach, describe, expect, it, vi } from "vitest";
import type { Station } from "@/data/stationTypes";
import {
  buildIberianOverviewViewport,
  IBERIAN_OVERVIEW_SIZE,
  latLngToWorldPx,
  pickZoomForPoints,
  projectLatLngToOverview,
  iberianOverviewCornerPoints,
} from "@/lib/visitedMapProjection";
import {
  listVisitedStations,
  renderVisitedMapPng,
} from "@/lib/visitedMapPng";

const sampleStations: Station[] = [
  {
    name: "Porto-Campanhã",
    lat: 41.1496,
    lng: -8.5859,
    country: "pt",
    lines: [],
    types: [],
  },
  {
    name: "Madrid-Atocha",
    lat: 40.4062,
    lng: -3.6892,
    country: "es",
    lines: [],
    types: [],
  },
  {
    name: "Somewhere Else",
    lat: 48.8566,
    lng: 2.3522,
    country: "fr",
    lines: [],
    types: [],
  },
];

describe("visitedMapProjection", () => {
  it("picks a zoom that keeps Iberian corners within the padded card", () => {
    const points = iberianOverviewCornerPoints();
    const zoom = pickZoomForPoints(points, IBERIAN_OVERVIEW_SIZE, IBERIAN_OVERVIEW_SIZE, 36, 12);
    expect(zoom).toBeGreaterThanOrEqual(1);
    expect(zoom).toBeLessThanOrEqual(12);

    const xs = points.map((p) => latLngToWorldPx(p.lat, p.lng, zoom).x);
    const ys = points.map((p) => latLngToWorldPx(p.lat, p.lng, zoom).y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    expect(spanX).toBeLessThanOrEqual(IBERIAN_OVERVIEW_SIZE - 72 + 1);
    expect(spanY).toBeLessThanOrEqual(IBERIAN_OVERVIEW_SIZE - 72 + 1);
  });

  it("projects Porto and Madrid inside the Iberian overview frame", () => {
    const viewport = buildIberianOverviewViewport();
    const porto = projectLatLngToOverview(41.1496, -8.5859, viewport);
    const madrid = projectLatLngToOverview(40.4062, -3.6892, viewport);

    for (const point of [porto, madrid]) {
      expect(point.x).toBeGreaterThan(0);
      expect(point.x).toBeLessThan(IBERIAN_OVERVIEW_SIZE);
      expect(point.y).toBeGreaterThan(0);
      expect(point.y).toBeLessThan(IBERIAN_OVERVIEW_SIZE);
    }

    // Porto is west of Madrid on the map
    expect(porto.x).toBeLessThan(madrid.x);
  });

  it("is stable for the same inputs", () => {
    const viewport = buildIberianOverviewViewport();
    const a = projectLatLngToOverview(38.7058, -9.1442, viewport);
    const b = projectLatLngToOverview(38.7058, -9.1442, viewport);
    expect(a).toEqual(b);
  });
});

describe("visitedMapPng", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("lists only visited Iberian stations from the catalog", () => {
    const visited = listVisitedStations(
      {
        "Porto-Campanhã": true,
        "Madrid-Atocha": true,
        "Somewhere Else": true,
        "Unknown Station": true,
        Ghost: false,
      },
      sampleStations,
    );
    expect(visited.map((s) => s.name).sort()).toEqual(["Madrid-Atocha", "Porto-Campanhã"]);
  });

  it("renders a PNG blob via canvas with a mocked basemap Image", async () => {
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      decoding = "async";
      width = IBERIAN_OVERVIEW_SIZE;
      height = IBERIAN_OVERVIEW_SIZE;
      set src(_url: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal("Image", MockImage);

    const drawImage = vi.fn();
    const beginPath = vi.fn();
    const arc = vi.fn();
    const fill = vi.fn();
    const stroke = vi.fn();
    const fillText = vi.fn();
    const measureText = vi.fn(() => ({ width: 120 }));
    const save = vi.fn();
    const restore = vi.fn();
    const moveTo = vi.fn();
    const arcTo = vi.fn();
    const closePath = vi.fn();

    const ctx = {
      drawImage,
      beginPath,
      arc,
      fill,
      stroke,
      fillText,
      measureText,
      save,
      restore,
      moveTo,
      arcTo,
      closePath,
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      font: "",
    };

    const toBlob = vi.fn((cb: (blob: Blob | null) => void) => {
      cb(new Blob(["png"], { type: "image/png" }));
    });

    const realCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return {
          width: 0,
          height: 0,
          getContext: () => ctx,
          toBlob,
        } as unknown as HTMLCanvasElement;
      }
      return realCreateElement(tag);
    });

    const result = await renderVisitedMapPng({
      visitedMap: { "Porto-Campanhã": true, "Madrid-Atocha": true },
      title: "Your visited stations map",
      countLabel: "2 visited stations",
      stations: sampleStations,
      basemapUrl: "/maps/overview/iberian-reliability.png",
    });

    expect(result.count).toBe(2);
    expect(result.filename).toBe("verystays-visited-map.png");
    expect(result.blob).toBeInstanceOf(Blob);
    expect(result.blob.type).toBe("image/png");
    expect(drawImage).toHaveBeenCalled();
    expect(arc).toHaveBeenCalled();
    expect(toBlob).toHaveBeenCalled();
  });

  it("rejects when nothing visited can be drawn", async () => {
    await expect(
      renderVisitedMapPng({
        visitedMap: {},
        title: "Empty",
        countLabel: "0",
        stations: sampleStations,
        basemapUrl: "/maps/overview/iberian-reliability.png",
      }),
    ).rejects.toThrow(/No visited stations/);
  });
});
