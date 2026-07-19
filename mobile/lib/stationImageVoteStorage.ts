import AsyncStorage from '@react-native-async-storage/async-storage';

export type ImageVoteDirection = 'up' | 'down';

export type StationImageVoteEntry = {
  vote: ImageVoteDirection;
  imageUrl: string;
};

export type StationImageVotesMap = Record<string, StationImageVoteEntry | ImageVoteDirection>;

const STATION_IMAGE_VOTES_KEY = 'station_image_votes';

export function normalizeStationImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function parseEntry(
  entry: StationImageVoteEntry | ImageVoteDirection | undefined,
): StationImageVoteEntry | null {
  if (!entry) return null;
  if (entry === 'up' || entry === 'down') {
    return { vote: entry, imageUrl: '' };
  }
  if (typeof entry === 'object' && (entry.vote === 'up' || entry.vote === 'down')) {
    return entry;
  }
  return null;
}

export async function readStationImageVotes(): Promise<StationImageVotesMap> {
  const raw = await AsyncStorage.getItem(STATION_IMAGE_VOTES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as StationImageVotesMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function writeStationImageVotes(votes: StationImageVotesMap): Promise<void> {
  await AsyncStorage.setItem(STATION_IMAGE_VOTES_KEY, JSON.stringify(votes));
}

export function getStationImageVoteForUrl(
  votes: StationImageVotesMap,
  stationName: string,
  imageUrl: string,
): ImageVoteDirection | null {
  const entry = parseEntry(votes[stationName]);
  if (!entry) return null;

  const current = normalizeStationImageUrl(imageUrl);
  const votedOn = normalizeStationImageUrl(entry.imageUrl);
  if (!votedOn || votedOn !== current) return null;

  return entry.vote;
}

/** Vote on a replaced image, including legacy entries without an image URL. */
export function getStaleStationImageVote(
  votes: StationImageVotesMap,
  stationName: string,
  imageUrl: string,
): ImageVoteDirection | null {
  const entry = parseEntry(votes[stationName]);
  if (!entry) return null;

  const current = normalizeStationImageUrl(imageUrl);
  const votedOn = normalizeStationImageUrl(entry.imageUrl);
  if (votedOn && votedOn === current) return null;

  return entry.vote;
}

export async function setStationImageVoteForUrl(
  stationName: string,
  imageUrl: string,
  vote: ImageVoteDirection | null,
): Promise<ImageVoteDirection | null> {
  const votes = await readStationImageVotes();
  if (vote === null) {
    delete votes[stationName];
  } else {
    votes[stationName] = { vote, imageUrl: normalizeStationImageUrl(imageUrl) };
  }
  await writeStationImageVotes(votes);
  return vote;
}

export async function clearStationImageVote(stationName: string): Promise<boolean> {
  const votes = await readStationImageVotes();
  if (!(stationName in votes)) return false;
  delete votes[stationName];
  await writeStationImageVotes(votes);
  return true;
}

export async function castStationImageVote(
  stationName: string,
  imageUrl: string,
  direction: ImageVoteDirection,
): Promise<{ previous: ImageVoteDirection | null; next: ImageVoteDirection | null }> {
  const votes = await readStationImageVotes();
  const previous = getStationImageVoteForUrl(votes, stationName, imageUrl);
  let next: ImageVoteDirection | null;

  if (previous === direction) {
    delete votes[stationName];
    next = null;
  } else {
    votes[stationName] = { vote: direction, imageUrl: normalizeStationImageUrl(imageUrl) };
    next = direction;
  }

  await writeStationImageVotes(votes);
  return { previous, next };
}
