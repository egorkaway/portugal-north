import type { Vote } from "@/hooks/useStationVote";

/** Background the control sits on — drives inactive-state contrast. */
export type VoteControlSurface = "card" | "primary";

const upActive =
  "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600/90";
const downActive =
  "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90";

const upInactiveOnCard =
  "bg-muted text-muted-foreground border-border hover:border-emerald-600/40 hover:text-emerald-700 dark:hover:text-emerald-300";
const downInactiveOnCard =
  "bg-muted text-muted-foreground border-border hover:border-destructive/40 hover:text-destructive";

const upInactiveOnPrimary =
  "bg-primary-foreground text-foreground border-primary-foreground/80 shadow-sm hover:border-emerald-600/50 hover:text-emerald-800 dark:hover:text-emerald-200";
const downInactiveOnPrimary =
  "bg-primary-foreground text-foreground border-primary-foreground/80 shadow-sm hover:border-destructive/50 hover:text-destructive";

export function voteUpButtonClassName(
  vote: Vote,
  surface: VoteControlSurface = "card",
): string {
  const base = "p-1.5 rounded-md border transition-colors";
  if (vote === "up") return `${base} ${upActive}`;
  return `${base} ${surface === "primary" ? upInactiveOnPrimary : upInactiveOnCard}`;
}

export function voteDownButtonClassName(
  vote: Vote,
  surface: VoteControlSurface = "card",
): string {
  const base = "p-1.5 rounded-md border transition-colors";
  if (vote === "down") return `${base} ${downActive}`;
  return `${base} ${surface === "primary" ? downInactiveOnPrimary : downInactiveOnCard}`;
}

const visitedActive =
  "border-amber-600 bg-amber-500 text-white hover:bg-amber-500/90";

const visitedInactiveOnCard = (compact: boolean) =>
  compact
    ? "border-border/80 bg-muted text-foreground/80 hover:border-amber-600/50 hover:text-amber-800 dark:hover:text-amber-200"
    : "border-border bg-muted text-muted-foreground hover:border-amber-600/50 hover:text-amber-800 dark:hover:text-amber-200";

const visitedInactiveOnPrimary =
  "border-primary-foreground/80 bg-primary-foreground text-foreground shadow-sm hover:border-amber-600/50 hover:text-amber-800 dark:hover:text-amber-200";

export function visitedButtonClassName(
  visited: boolean,
  surface: VoteControlSurface = "card",
  compact = false,
): string {
  const base =
    "inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors shrink-0";
  if (visited) return `${base} ${visitedActive}`;
  if (surface === "primary") return `${base} ${visitedInactiveOnPrimary}`;
  return `${base} ${visitedInactiveOnCard(compact)}`;
}
