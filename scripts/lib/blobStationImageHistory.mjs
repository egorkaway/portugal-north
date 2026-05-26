import { BlobNotFoundError, get, put } from "@vercel/blob";
import { normalizeHistory } from "./stationImageHistory.mjs";

export const STATION_IMAGE_HISTORY_PATH = "station-image-history.json";

function getToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  return token;
}

function clientOptions() {
  const token = getToken();
  if (!token) return null;
  return {
    access: "private",
    token,
    abortSignal: AbortSignal.timeout(12_000),
  };
}

export function isImageHistoryBlobConfigured() {
  return Boolean(getToken());
}

/**
 * @returns {Promise<import("./stationImageHistory.mjs").StationImageHistory>}
 */
export async function readImageHistoryFromBlob() {
  const opts = clientOptions();
  if (!opts) return {};

  try {
    const result = await get(STATION_IMAGE_HISTORY_PATH, opts);
    if (!result?.stream) return {};
    const text = await new Response(result.stream).text();
    if (!text) return {};
    return normalizeHistory(JSON.parse(text));
  } catch (error) {
    if (error instanceof BlobNotFoundError) return {};
    throw error;
  }
}

/**
 * @param {import("./stationImageHistory.mjs").StationImageHistory} history
 */
export async function writeImageHistoryToBlob(history) {
  const opts = clientOptions();
  if (!opts) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required to persist image history.");
  }

  const sorted = Object.fromEntries(
    Object.entries(history).sort(([a], [b]) => a.localeCompare(b)),
  );

  await put(STATION_IMAGE_HISTORY_PATH, JSON.stringify(sorted, null, 2), {
    ...opts,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
