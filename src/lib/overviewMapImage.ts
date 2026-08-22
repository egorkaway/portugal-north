export type OverviewMapKind = "activity" | "reliability";
export type OverviewMapRegion = "portugal" | "iberian";

export const OVERVIEW_MAP_DIMENSIONS: Record<
  OverviewMapRegion,
  { width: number; height: number; aspectClass: string }
> = {
  portugal: { width: 1080, height: 1350, aspectClass: "aspect-[4/5]" },
  iberian: { width: 1080, height: 1080, aspectClass: "aspect-square" },
};

/** @deprecated use OVERVIEW_MAP_DIMENSIONS.portugal.width */
export const OVERVIEW_MAP_WIDTH = OVERVIEW_MAP_DIMENSIONS.portugal.width;

/** @deprecated use OVERVIEW_MAP_DIMENSIONS.portugal.height */
export const OVERVIEW_MAP_HEIGHT = OVERVIEW_MAP_DIMENSIONS.portugal.height;

export function getOverviewMapImagePath(
  kind: OverviewMapKind,
  region: OverviewMapRegion = "portugal",
): string {
  return `/maps/overview/${region}-${kind}.png`;
}

export function getOverviewMapDownloadFilename(
  kind: OverviewMapKind,
  region: OverviewMapRegion = "portugal",
): string {
  return `verystays-${region}-${kind}.png`;
}
