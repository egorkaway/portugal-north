import { useEffect, useState } from "react";

export type Vote = "up" | "down" | null;

const COOKIE_NAME = "station_votes";

function readVotes(): Record<string, "up" | "down"> {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1])) || {};
  } catch {
    return {};
  }
}

function writeVotes(votes: Record<string, "up" | "down">) {
  const value = encodeURIComponent(JSON.stringify(votes));
  // 1 year, same-site
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function useStationVote(stationName: string) {
  const [vote, setVote] = useState<Vote>(null);

  useEffect(() => {
    const votes = readVotes();
    setVote(votes[stationName] ?? null);
  }, [stationName]);

  const cast = (next: "up" | "down") => {
    const votes = readVotes();
    if (votes[stationName] === next) {
      delete votes[stationName];
      setVote(null);
    } else {
      votes[stationName] = next;
      setVote(next);
    }
    writeVotes(votes);
  };

  return { vote, cast };
}
