import AsyncStorage from '@react-native-async-storage/async-storage';

export type Vote = 'up' | 'down' | null;
export type VotesMap = Record<string, 'up' | 'down'>;

const STATION_VOTES_KEY = 'station_votes';
const VISITED_KEY = 'station_visited';

export async function readStationVotes(): Promise<VotesMap> {
  const raw = await AsyncStorage.getItem(STATION_VOTES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as VotesMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function writeStationVotes(votes: VotesMap): Promise<void> {
  await AsyncStorage.setItem(STATION_VOTES_KEY, JSON.stringify(votes));
}

export async function castStationVote(
  stationName: string,
  direction: 'up' | 'down',
): Promise<{ previous: Vote; next: Vote }> {
  const votes = await readStationVotes();
  const previous = votes[stationName] ?? null;
  let next: Vote;

  if (previous === direction) {
    delete votes[stationName];
    next = null;
  } else {
    votes[stationName] = direction;
    next = direction;
  }

  await writeStationVotes(votes);
  return { previous, next };
}

export async function readVisitedMap(): Promise<Record<string, boolean>> {
  const raw = await AsyncStorage.getItem(VISITED_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function toggleVisited(stationName: string): Promise<boolean> {
  const map = await readVisitedMap();
  const next = !map[stationName];
  if (next) {
    map[stationName] = true;
  } else {
    delete map[stationName];
  }
  await AsyncStorage.setItem(VISITED_KEY, JSON.stringify(map));
  return next;
}
