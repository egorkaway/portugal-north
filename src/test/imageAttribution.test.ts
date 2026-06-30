import { describe, expect, it } from "vitest";
import { attributionForImageUrl } from "@/lib/imageAttribution";
import { pexelsPhotoIdFromUrl } from "@/lib/pexelsPhotoId";
import {
  getStationPhotoAlt,
  shouldShowStationImageCredit,
} from "@/lib/stationImageAttribution";

describe("pexelsPhotoIdFromUrl", () => {
  it("extracts photo id from Pexels CDN URLs", () => {
    expect(
      pexelsPhotoIdFromUrl(
        "https://images.pexels.com/photos/953125/pexels-photo-953125.jpeg?auto=compress",
      ),
    ).toBe("953125");
  });
});

describe("attributionForImageUrl", () => {
  it("parses Wikimedia author names from filenames", () => {
    const attribution = attributionForImageUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Estacao_Campanha_Porto_Flickr_-_nmorao.jpg/960px-Estacao_Campanha_Porto_Flickr_-_nmorao.jpg",
    );
    expect(attribution.creator).toEqual({ "@type": "Person", name: "nmorao" });
    expect(attribution.sourceName).toBe("Wikimedia Commons");
  });

  it("uses generic Pexels attribution when photographer credit is unknown", () => {
    const attribution = attributionForImageUrl(
      "https://images.pexels.com/photos/999999/pexels-photo-999999.jpeg",
    );
    expect(attribution.creator).toEqual({ "@type": "Organization", name: "Pexels" });
  });
});

describe("stationImageAttribution", () => {
  it("builds alt text with author when known", () => {
    const alt = getStationPhotoAlt(
      "Aveiro",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Estacao_Campanha_Porto_Flickr_-_nmorao.jpg/960px-Estacao_Campanha_Porto_Flickr_-_nmorao.jpg",
      (key, vars) => `${key}:${JSON.stringify(vars)}`,
    );
    expect(alt).toContain("nmorao");
  });

  it("hides credit UI for placeholder images", () => {
    expect(shouldShowStationImageCredit("/station-placeholder.svg")).toBe(false);
  });
});
