import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { stations } from "@/data/stations";
import { StationCard } from "@/components/StationCard";
import { StationRankings } from "@/components/StationRankings";
import {
  Search,
  TrainFront,
  ThumbsUp,
  ThumbsDown,
  Circle,
  Navigation,
} from "lucide-react";
import heroStation from "@/assets/hero-station.jpg";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { buildHomeStructuredData } from "@/lib/structuredData";
import { PageHead } from "@/components/PageHead";
import { getHomePageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { useGlobalStationRatings } from "@/hooks/useGlobalStationRatings";
import { useAllVotes } from "@/hooks/useStationVote";
import { useUserLocation } from "@/hooks/useUserLocation";
import { distanceKm } from "@/lib/geo";
import { sortStationsByCommunityUpvotes } from "@/lib/rankStations";

const allTypes = [...new Set(stations.flatMap((s) => s.types))];

type VoteFilter = "up" | "down" | "none";

const Index = () => {
  const { t, plural, locale, messages } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [voteFilter, setVoteFilter] = useState<VoteFilter | null>(null);
  const votes = useAllVotes();
  const { data: globalVotes } = useGlobalStationRatings();
  const { state: locationState, coords, isActive: sortByDistance, requestLocation } =
    useUserLocation();

  const sortByCommunityVotes =
    !sortByDistance &&
    Boolean(
      globalVotes?.configured &&
        globalVotes.ratings &&
        Object.values(globalVotes.ratings).some((r) => r.up > 0),
    );

  const filtered = useMemo(() => {
    const matches = stations.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.lines.some((l) => l.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = !activeFilter || s.types.includes(activeFilter);
      const v = votes[s.name];
      const matchesVote =
        !voteFilter ||
        (voteFilter === "up" && v === "up") ||
        (voteFilter === "down" && v === "down") ||
        (voteFilter === "none" && !v);
      return matchesSearch && matchesFilter && matchesVote;
    });

    if (coords) {
      return [...matches].sort(
        (a, b) =>
          distanceKm(coords.lat, coords.lng, a.lat, a.lng) -
          distanceKm(coords.lat, coords.lng, b.lat, b.lng),
      );
    }

    if (globalVotes?.configured && globalVotes.ratings) {
      return sortStationsByCommunityUpvotes(matches, globalVotes.ratings);
    }

    return matches;
  }, [search, activeFilter, voteFilter, votes, coords, globalVotes]);

  const distanceByStation = useMemo(() => {
    if (!coords) return null;
    return Object.fromEntries(
      filtered.map((station) => [
        station.name,
        distanceKm(coords.lat, coords.lng, station.lat, station.lng),
      ]),
    );
  }, [filtered, coords]);

  const setSearchQuery = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHead meta={getHomePageMeta(locale)} />
      <JsonLd data={buildHomeStructuredData()} />
      {/* Hero */}
      <header className="relative text-primary-foreground py-20 md:py-28 px-6 overflow-hidden bg-primary">
        <img
          src={heroStation}
          alt="Historic Portuguese train station at golden hour with azulejo tiles"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="relative max-w-5xl mx-auto">
          <h1 className="mb-4 font-display text-4xl md:text-5xl">
            <a
              href="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
              className="inline-flex items-center gap-3 text-primary-foreground transition-opacity hover:opacity-90"
            >
              <TrainFront className="h-8 w-8 shrink-0" aria-hidden="true" />
              {messages.site.name}
            </a>
          </h1>
          <p className="text-primary-foreground/90 text-lg max-w-2xl">{t("home.heroSubtitle")}</p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <label htmlFor="station-search" className="sr-only">
                {t("home.searchLabel")}
              </label>
              <input
                id="station-search"
                type="search"
                aria-label={t("home.searchLabel")}
                placeholder={t("home.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <button
              type="button"
              onClick={requestLocation}
              disabled={locationState.status === "loading"}
              aria-pressed={sortByDistance}
              className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors shrink-0 ${
                sortByDistance
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30 hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              } disabled:cursor-wait disabled:opacity-80`}
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              {locationState.status === "loading"
                ? t("home.locating")
                : sortByDistance
                  ? t("home.sortedByDistance")
                  : t("home.sortByDistance")}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {allTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setActiveFilter(activeFilter === type ? null : type)
                }
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto hidden max-w-5xl flex-wrap items-center gap-1.5 px-6 pb-3 md:flex">
          <span className="text-xs text-muted-foreground mr-1">{t("home.yourVotes")}</span>
          {([
            { key: "up" as const, label: t("home.upvoted"), Icon: ThumbsUp },
            { key: "down" as const, label: t("home.downvoted"), Icon: ThumbsDown },
            { key: "none" as const, label: t("home.notVoted"), Icon: Circle },
          ]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setVoteFilter(voteFilter === key ? null : key)}
              className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                voteFilter === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground mb-4">
          {plural("home.stationCount", filtered.length, { count: filtered.length })}
          {sortByDistance
            ? t("home.sortedByDistanceNote")
            : sortByCommunityVotes
              ? t("home.topCommunityPicks")
              : ""}
          {locationState.status === "denied"
            ? t("home.locationDenied")
            : locationState.status === "unsupported"
              ? t("home.locationUnsupported")
              : locationState.status === "error"
                ? t("home.locationError")
                : ""}
          {!sortByDistance && t("home.bookingHint")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((station) => (
            <StationCard
              key={station.name}
              station={station}
              distanceKm={distanceByStation?.[station.name]}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            {t("home.noResults")}
          </p>
        )}
      </main>

      <StationRankings />

      <SiteFooter />
    </div>
  );
};

export default Index;
