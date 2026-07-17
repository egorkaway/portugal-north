export type OverviewMapKind = "activity" | "reliability";

/** Portrait 1080×1350 (4:5) Portugal overview map under public/maps/overview/. */
export const OVERVIEW_MAP_WIDTH = 1080;
export const OVERVIEW_MAP_HEIGHT = 1350;

export function getOverviewMapImagePath(kind: OverviewMapKind): string {
  return `/maps/overview/portugal-${kind}.png`;
}

export function getOverviewMapDownloadFilename(kind: OverviewMapKind): string {
  return `verystays-portugal-${kind}.png`;
}
