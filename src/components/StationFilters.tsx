import type { LucideIcon } from "lucide-react";
import {
  Check,
  Circle,
  MapPin,
  Navigation,
  Search,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTrainTypeAbbrev } from "@/lib/trainTypes";
import { useLocale } from "@/i18n/LocaleProvider";
import type { UserLocationState } from "@/hooks/useUserLocation";

type VoteFilter = "up" | "down" | "none";
type VisitedFilter = "visited" | "notVisited";

const chipInactive =
  "border-border bg-card text-muted-foreground hover:border-primary/40";
const chipActivePrimary = "border-primary bg-primary text-primary-foreground";
const chipActiveVisited = "border-emerald-700 bg-emerald-700 text-white";

function FilterChip({
  active,
  activeClassName,
  onClick,
  label,
  accessibilityLabel,
  icon: Icon,
  compact = false,
}: {
  active: boolean;
  activeClassName: string;
  onClick: () => void;
  label: string;
  /** Screen reader / tooltip when label is abbreviated. */
  accessibilityLabel?: string;
  icon?: LucideIcon;
  /** Icon-only on the narrowest screens; label from `sm` up. */
  compact?: boolean;
}) {
  const a11yLabel = accessibilityLabel ?? label;
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={a11yLabel}
      title={a11yLabel}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-medium transition-colors",
        "text-[11px] leading-none md:text-xs",
        compact
          ? "h-7 w-7 gap-0 p-0 sm:h-auto sm:w-auto sm:gap-1 sm:px-2 sm:py-1 md:px-2.5"
          : "gap-1 px-2 py-1 md:px-2.5",
        active ? activeClassName : chipInactive,
      )}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      <span
        className={cn(
          compact && "sr-only sm:not-sr-only sm:static sm:max-w-none",
          !compact && "max-w-[5.5rem] truncate sm:max-w-none",
        )}
      >
        {label}
      </span>
    </button>
  );
}

function FilterDivider() {
  return (
    <span
      className="mx-0.5 hidden h-3 w-px shrink-0 bg-border sm:inline-block"
      aria-hidden="true"
    />
  );
}

export function StationFilters({
  search,
  onSearchChange,
  trainTypes,
  activeType,
  onTypeToggle,
  voteFilter,
  onVoteFilterToggle,
  visitedFilter,
  onVisitedFilterToggle,
  sortByDistance,
  onRequestLocation,
  locationState,
  coords,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  trainTypes: string[];
  activeType: string | null;
  onTypeToggle: (type: string) => void;
  voteFilter: VoteFilter | null;
  onVoteFilterToggle: (key: VoteFilter) => void;
  visitedFilter: VisitedFilter | null;
  onVisitedFilterToggle: (key: VisitedFilter) => void;
  sortByDistance: boolean;
  onRequestLocation: () => void;
  locationState: UserLocationState;
  coords: { lat: number; lng: number } | null;
}) {
  const { t } = useLocale();

  const locationLabel =
    locationState.status === "loading"
      ? t("home.locating")
      : coords
        ? t("home.sortedByDistance")
        : sortByDistance &&
            (locationState.status === "denied" || locationState.status === "error")
          ? t("home.locationBlocked")
          : t("home.sortByDistance");

  const voteOptions = [
    { key: "up" as const, label: t("home.upvoted"), Icon: ThumbsUp },
    { key: "down" as const, label: t("home.downvoted"), Icon: ThumbsDown },
    { key: "none" as const, label: t("home.notVoted"), Icon: Circle },
  ];

  const visitOptions = [
    { key: "visited" as const, label: t("home.visited"), Icon: Check },
    { key: "notVisited" as const, label: t("home.notVisitedYet"), Icon: MapPin },
  ];

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-5xl space-y-1.5 px-3 py-2 md:space-y-2 md:px-6 md:py-2.5">
        <div className="flex gap-1.5 sm:gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="station-search" className="sr-only">
              {t("home.searchLabel")}
            </label>
            <input
              id="station-search"
              type="search"
              aria-label={t("home.searchLabel")}
              placeholder={t("home.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring md:h-9 md:pl-9"
            />
          </div>
          <button
            type="button"
            onClick={onRequestLocation}
            disabled={locationState.status === "loading"}
            aria-pressed={sortByDistance}
            aria-label={locationLabel}
            title={locationLabel}
            className={cn(
              "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold shadow-sm transition-colors md:h-9 md:px-3 md:text-sm",
              sortByDistance
                ? "bg-primary text-primary-foreground ring-1 ring-primary/30 hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90",
              "disabled:cursor-wait disabled:opacity-80",
            )}
          >
            <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden max-w-[4.5rem] truncate sm:inline md:max-w-[8rem]">
              {locationLabel}
            </span>
          </button>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 md:gap-1.5"
          role="group"
          aria-label={t("home.filtersLabel")}
        >
          {trainTypes.map((type) => (
            <FilterChip
              key={type}
              active={activeType === type}
              activeClassName={chipActivePrimary}
              onClick={() => onTypeToggle(type)}
              label={getTrainTypeAbbrev(type)}
              accessibilityLabel={type}
            />
          ))}

          <FilterDivider />

          {voteOptions.map(({ key, label, Icon }) => (
            <FilterChip
              key={key}
              active={voteFilter === key}
              activeClassName={chipActivePrimary}
              onClick={() => onVoteFilterToggle(key)}
              label={label}
              icon={Icon}
              compact
            />
          ))}

          <FilterDivider />

          {visitOptions.map(({ key, label, Icon }) => (
            <FilterChip
              key={key}
              active={visitedFilter === key}
              activeClassName={chipActiveVisited}
              onClick={() => onVisitedFilterToggle(key)}
              label={label}
              icon={Icon}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}
