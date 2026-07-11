const listeners = new Set<() => void>();

export function subscribeTripChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyTripChanged(): void {
  listeners.forEach((listener) => listener());
}
