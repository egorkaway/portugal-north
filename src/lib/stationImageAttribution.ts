import { attributionForImageUrl } from "@/lib/imageAttribution";
import { isPlaceholderImageUrl } from "@/lib/stationImage";

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function getStationPhotoAlt(
  stationName: string,
  imageUrl: string,
  t: Translate,
): string {
  if (isPlaceholderImageUrl(imageUrl)) {
    return t("station.stationPhotoAlt", { name: stationName });
  }
  const { creator } = attributionForImageUrl(imageUrl);
  if (creator["@type"] === "Person") {
    return t("station.stationPhotoAltBy", {
      name: stationName,
      author: creator.name,
    });
  }
  return t("station.stationPhotoAlt", { name: stationName });
}

export function shouldShowStationImageCredit(imageUrl: string): boolean {
  if (isPlaceholderImageUrl(imageUrl)) return false;
  const { creator } = attributionForImageUrl(imageUrl);
  return creator["@type"] === "Person";
}
