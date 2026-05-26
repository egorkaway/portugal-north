import { BlobNotFoundError, get, put } from "@vercel/blob";

const COMMUNITY_VOTES_PATH = "community-votes.json";

function getToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Set BLOB_READ_WRITE_TOKEN to modify community votes in Blob storage.");
  }
  return token;
}

function clientOptions() {
  return {
    access: "private",
    token: getToken(),
    abortSignal: AbortSignal.timeout(12_000),
  };
}

/**
 * @returns {Promise<Record<string, unknown>>}
 */
export async function readCommunityVotesBlob() {
  try {
    const result = await get(COMMUNITY_VOTES_PATH, clientOptions());
    if (!result?.stream) {
      return { ratings: {}, hotelRatings: {}, imageRatings: {}, hotelClosedReports: {} };
    }
    const text = await new Response(result.stream).text();
    if (!text) {
      return { ratings: {}, hotelRatings: {}, imageRatings: {}, hotelClosedReports: {} };
    }
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return { ratings: {}, hotelRatings: {}, imageRatings: {}, hotelClosedReports: {} };
    }
    throw error;
  }
}

/**
 * @param {Record<string, unknown>} data
 */
export async function writeCommunityVotesBlob(data) {
  await put(COMMUNITY_VOTES_PATH, JSON.stringify(data), {
    ...clientOptions(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/**
 * Remove image vote totals for stations after a photo refresh (so counts match the new image).
 *
 * @param {string[]} stationNames
 * @returns {Promise<string[]>} stations that were cleared
 */
export async function clearImageRatingsForStations(stationNames) {
  const data = await readCommunityVotesBlob();
  const imageRatings =
    data.imageRatings && typeof data.imageRatings === "object"
      ? { .../** @type {Record<string, unknown>} */ (data.imageRatings) }
      : {};

  const cleared = [];
  for (const name of stationNames) {
    if (name in imageRatings) {
      delete imageRatings[name];
      cleared.push(name);
    }
  }

  if (cleared.length === 0) return [];

  await writeCommunityVotesBlob({ ...data, imageRatings });
  return cleared;
}
