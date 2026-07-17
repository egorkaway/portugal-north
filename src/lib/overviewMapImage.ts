export type OverviewMapKind = "activity" | "reliability";

/** Square 1080×1080 Portugal overview map under public/maps/overview/. */
export function getOverviewMapImagePath(kind: OverviewMapKind): string {
  return `/maps/overview/portugal-${kind}.png`;
}

export function getOverviewMapDownloadFilename(kind: OverviewMapKind): string {
  return `verystays-portugal-${kind}.png`;
}
