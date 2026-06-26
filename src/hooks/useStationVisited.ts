import { useSyncExternalStore } from "react";
import {
  readVisitedMap,
  toggleStationVisited,
  writeVisitedMap,
  type VisitedMap,
} from "@/lib/stationVisitedStorage";

const listeners = new Set<() => void>();
let cache: VisitedMap | null = null;

function getSnapshot(): VisitedMap {
  if (cache === null) cache = readVisitedMap();
  return cache;
}

function emit() {
  cache = readVisitedMap();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAllVisited(): VisitedMap {
  return useSyncExternalStore(subscribe, getSnapshot, () => ({}));
}

export function toggleStationVisitedAt(stationName: string): boolean {
  const current = readVisitedMap();
  const { next, visited } = toggleStationVisited(current, stationName);
  writeVisitedMap(next);
  emit();
  return visited;
}

export function useStationVisited(stationName: string) {
  const visitedMap = useAllVisited();
  const visited = Boolean(visitedMap[stationName]);

  const toggle = () => {
    toggleStationVisitedAt(stationName);
  };

  return { visited, toggle };
}
