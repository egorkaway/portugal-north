import { readFileSync, writeFileSync } from "node:fs";

/** @typedef {{ stationName: string, hotelName: string, normalizedName: string, bookingUrl: string, reason: string, rejectedAt: string }} RejectedHotelEntry */

/** @typedef {{ entries: RejectedHotelEntry[] }} RejectedHotelsFile */

export function normHotelName(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizeBookingUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.href.replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * @param {string} path
 * @returns {RejectedHotelsFile}
 */
export function readRejectedHotels(path) {
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    return normalizeRejectedHotels(raw);
  } catch {
    return { entries: [] };
  }
}

/**
 * @param {unknown} raw
 * @returns {RejectedHotelsFile}
 */
export function normalizeRejectedHotels(raw) {
  const entries = Array.isArray(raw?.entries) ? raw.entries : [];
  /** @type {RejectedHotelEntry[]} */
  const out = [];
  const seen = new Set();

  for (const item of entries) {
    if (!item || typeof item !== "object") continue;
    const entry = /** @type {Record<string, unknown>} */ (item);
    const stationName = typeof entry.stationName === "string" ? entry.stationName.trim() : "";
    const hotelName = typeof entry.hotelName === "string" ? entry.hotelName.trim() : "";
    const bookingUrl = typeof entry.bookingUrl === "string" ? entry.bookingUrl.trim() : "";
    if (!stationName || !hotelName || !bookingUrl.startsWith("http")) continue;

    const normalizedName =
      typeof entry.normalizedName === "string" && entry.normalizedName
        ? entry.normalizedName
        : normHotelName(hotelName);
    const key = `${stationName}\0${normalizedName}\0${normalizeBookingUrl(bookingUrl)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      stationName,
      hotelName,
      normalizedName,
      bookingUrl,
      reason: typeof entry.reason === "string" ? entry.reason : "broken_link",
      rejectedAt:
        typeof entry.rejectedAt === "string" ? entry.rejectedAt : new Date().toISOString(),
    });
  }

  out.sort((a, b) => {
    const station = a.stationName.localeCompare(b.stationName);
    if (station !== 0) return station;
    return a.hotelName.localeCompare(b.hotelName);
  });

  return { entries: out };
}

/**
 * @param {string} path
 * @param {RejectedHotelsFile} data
 */
export function writeRejectedHotels(path, data) {
  writeFileSync(path, `${JSON.stringify(normalizeRejectedHotels(data), null, 2)}\n`);
}

/**
 * @param {RejectedHotelsFile} data
 * @param {RejectedHotelEntry} entry
 */
export function addRejectedHotel(data, entry) {
  const normalized = normalizeRejectedHotels({
    entries: [...data.entries, entry],
  });
  data.entries = normalized.entries;
}

/**
 * @param {RejectedHotelsFile} data
 * @param {string} stationName
 * @param {string} hotelName
 * @param {string} [bookingUrl]
 */
export function isRejectedHotel(data, stationName, hotelName, bookingUrl = "") {
  const normalizedName = normHotelName(hotelName);
  const normalizedUrl = bookingUrl ? normalizeBookingUrl(bookingUrl) : "";

  return data.entries.some((entry) => {
    if (entry.stationName !== stationName) return false;
    if (entry.normalizedName === normalizedName) return true;
    if (normalizedUrl && normalizeBookingUrl(entry.bookingUrl) === normalizedUrl) return true;
    return false;
  });
}
