export function formatTrainSpotlightDelay(minutes: number): string {
  const rounded = Math.round(minutes * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function trainSpotlightDelayColor(minutes: number): string {
  if (minutes <= 1) return '#059669';
  if (minutes <= 4) return '#d97706';
  return '#dc2626';
}
