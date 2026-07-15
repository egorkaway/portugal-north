/** Greater Lisbon metro bbox (CP commuter belt, south bank, Cascais/Sintra, airport). */
export function isLisbonArea(station) {
  if (station.country && station.country !== "pt") return false;
  const { lat, lng } = station;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return lat >= 38.55 && lat <= 39.15 && lng >= -9.55 && lng <= -8.85;
}

export function matchesMapRegion(station, region) {
  if (!region || region === "all") return true;
  if (region === "lisbon") return isLisbonArea(station);
  return false;
}
