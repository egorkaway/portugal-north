/**
 * @param {string} apiBase e.g. https://www.verystays.com
 * @returns {Promise<{ configured: boolean, imageRatings: Record<string, { up: number, down: number }> }>}
 */
export async function fetchLiveVotes(apiBase) {
  const base = apiBase.replace(/\/$/, "");
  const url = `${base}/api/votes`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Votes API ${res.status} from ${url}`);
  }
  const data = await res.json();
  if (data.configured === false) {
    throw new Error(
      "Vote storage is not configured on this deployment (BLOB_READ_WRITE_TOKEN missing).",
    );
  }
  return {
    configured: Boolean(data.configured),
    imageRatings: normalizeImageRatings(data.imageRatings),
  };
}

/**
 * @param {unknown} raw
 * @returns {Record<string, { up: number, down: number }>}
 */
function normalizeImageRatings(raw) {
  if (!raw || typeof raw !== "object") return {};
  /** @type {Record<string, { up: number, down: number }>} */
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const entry = /** @type {{ up?: unknown, down?: unknown }} */ (value);
    const up = Math.max(0, Math.floor(Number(entry.up) || 0));
    const down = Math.max(0, Math.floor(Number(entry.down) || 0));
    if (up > 0 || down > 0) out[key] = { up, down };
  }
  return out;
}
