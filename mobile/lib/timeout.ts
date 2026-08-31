/** Reject if `promise` does not settle within `ms`. */
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[timeout] ${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Resolve with `fallback` if `promise` is too slow or throws. Never rejects. */
export async function raceTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
  label = 'operation',
): Promise<T> {
  try {
    return await withTimeout(promise, ms, label);
  } catch {
    return fallback;
  }
}
