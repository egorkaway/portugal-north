import { useEffect, useState } from "react";

/** Current time, refreshed once per minute (aligned for departure countdowns). */
export function useNowMinute(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const scheduleNext = () => {
      const current = new Date();
      const msToNextMinute =
        (60 - current.getSeconds()) * 1000 - current.getMilliseconds();
      return window.setTimeout(() => {
        setNow(new Date());
        intervalId = window.setInterval(() => setNow(new Date()), 60_000);
      }, Math.max(msToNextMinute, 0));
    };

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = scheduleNext();

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return now;
}
