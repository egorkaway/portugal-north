import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("public/data/airport-connections.json", "utf8"));
const entry = data.airports.BCN;
const dests = entry.connections ?? entry.destinations ?? [];
const origin = entry.origin;
console.log("origin", origin);
console.log("count", dests.length);
const pts = dests.map((d) => ({
  iata: d.iata ?? d.code,
  lat: d.lat ?? d.latitude,
  lng: d.lng ?? d.longitude,
  name: d.name ?? d.city,
}));
const lats = pts.map((p) => p.lat).filter(Number.isFinite);
const lngs = pts.map((p) => p.lng).filter(Number.isFinite);
console.log("lat", Math.min(...lats), Math.max(...lats));
console.log("lng", Math.min(...lngs), Math.max(...lngs));
const med = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const mlat = med(lats);
const mlng = med(lngs);
const withDist = pts
  .filter((p) => Number.isFinite(p.lat))
  .map((p) => ({
    ...p,
    dist: Math.hypot(p.lat - mlat, p.lng - mlng),
  }))
  .sort((a, b) => b.dist - a.dist);
console.log(
  "farthest",
  withDist.slice(0, 20).map((p) => `${p.iata} d=${p.dist.toFixed(1)} (${p.lat.toFixed(1)},${p.lng.toFixed(1)}) ${p.name ?? ""}`),
);
