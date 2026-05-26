import { readFileSync, writeFileSync } from "node:fs";

/** @typedef {{ rejectedUrls: string[], refreshes: { at: string, from: string, to: string, reason: string, votesAtRefresh: { up: number, down: number } }[] }} StationImageHistoryEntry */

/** @typedef {Record<string, StationImageHistoryEntry>} StationImageHistory */

/**
 * @param {string} historyPath
 * @returns {StationImageHistory}
 */
export function readImageHistory(historyPath) {
  try {
    const raw = JSON.parse(readFileSync(historyPath, "utf8"));
    return normalizeHistory(raw);
  } catch {
    return {};
  }
}

/**
 * @param {unknown} raw
 * @returns {StationImageHistory}
 */
export function normalizeHistory(raw) {
  /** @type {StationImageHistory} */
  const out = {};
  for (const [name, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const entry = /** @type {Record<string, unknown>} */ (value);
    const rejectedUrls = Array.isArray(entry.rejectedUrls)
      ? [...new Set(entry.rejectedUrls.filter((u) => typeof u === "string" && u.startsWith("http")))]
      : [];
    const refreshes = Array.isArray(entry.refreshes)
      ? entry.refreshes.filter((r) => r && typeof r === "object")
      : [];
    out[name] = { rejectedUrls, refreshes };
  }
  return out;
}

/**
 * @param {string} historyPath
 * @param {StationImageHistory} history
 */
export function writeImageHistory(historyPath, history) {
  const sorted = Object.fromEntries(
    Object.entries(history).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(historyPath, `${JSON.stringify(sorted, null, 2)}\n`);
}

/**
 * @param {StationImageHistory} history
 * @param {string} stationName
 * @param {string} url
 */
export function addRejectedUrl(history, stationName, url) {
  if (!url || !url.startsWith("http")) return;
  if (!history[stationName]) {
    history[stationName] = { rejectedUrls: [], refreshes: [] };
  }
  const set = new Set(history[stationName].rejectedUrls);
  set.add(url);
  history[stationName].rejectedUrls = [...set];
}

/**
 * @param {StationImageHistory} history
 * @param {string} stationName
 * @param {{ from: string, to: string, reason: string, votesAtRefresh: { up: number, down: number } }} refresh
 */
export function recordRefresh(history, stationName, refresh) {
  if (!history[stationName]) {
    history[stationName] = { rejectedUrls: [], refreshes: [] };
  }
  history[stationName].refreshes.push({
    at: new Date().toISOString(),
    from: refresh.from,
    to: refresh.to,
    reason: refresh.reason,
    votesAtRefresh: refresh.votesAtRefresh,
  });
}

/**
 * @param {StationImageHistory} history
 * @param {string} stationName
 * @returns {Set<string>}
 */
export function rejectedUrlsForStation(history, stationName) {
  return new Set(history[stationName]?.rejectedUrls ?? []);
}
