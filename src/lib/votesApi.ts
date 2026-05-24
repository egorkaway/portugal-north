import type { GlobalRatings, VoteDirection, VoteSyncPayload } from "@/lib/voteTypes";

const API_BASE = "/api/votes";

export async function syncVoteToServer(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<void> {
  const payload: VoteSyncPayload = { station, previous, next };
  try {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Local cookie vote still works if the API is unreachable.
  }
}

export async function fetchGlobalRatings(): Promise<GlobalRatings> {
  const res = await fetch(API_BASE, { cache: "no-store" });
  if (!res.ok) return {};
  const data = (await res.json()) as { ratings?: GlobalRatings };
  return data.ratings ?? {};
}
