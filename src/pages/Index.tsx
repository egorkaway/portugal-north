import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { stations } from "@/data/stations";
import { StationCard } from "@/components/StationCard";
import { StationRankings } from "@/components/StationRankings";
import { TrainFront } from "lucide-react";
import { StationFilters } from "@/components/StationFilters";
import heroStation from "@/assets/hero-station.jpg";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { buildHomeStructuredData } from "@/lib/structuredData";
import { PageHead } from "@/components/PageHead";
import { getHomePageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { useGlobalStationRatings } from "@/hooks/useGlobalStationRatings";
import { useAllVotes } from "@/hooks/useStationVote";
import { useAllVisited } from "@/hooks/useStationVisited";
import { useUserLocation } from "@/hooks/useUserLocation";
import { orderStationsForHome, stationDistancesKm } from "@/lib/rankStations";
import { stationMatchesSearch } from "@/lib/searchText";
import { sortTrainTypes } from "@/lib/trainTypes";

const allTypes = sortTrainTypes([...new Set(stations.flatMap((s) => s.types))]);

type VoteFilter = "up" | "down" | "none";
type VisitedFilter = "visited" | "notVisited";

const Index = () => {
  const { t, plural, locale, messages } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [voteFilter, setVoteFilter] = useState<VoteFilter | null>(null);
  const [visitedFilter, setVisitedFilter] = useState<VisitedFilter | null>(null);
  const votes = useAllVotes();
  const visitedMap = useAllVisited();
  const { data: globalVotes } = useGlobalStationRatings();
  const { state: locationState, coords, isActive: sortByDistance, requestLocation } =
    useUserLocation();

  const hasCommunityUpvotes = Boolean(
    globalVotes?.configured &&
      globalVotes.ratings &&
      Object.values(globalVotes.ratings).some((r) => r.up > 0),
  );

  const sortByCommunityVotes = !sortByDistance && hasCommunityUpvotes;

  const filtered = useMemo(() => {
    const matches = stations.filter((s) => {
      const matchesSearch = stationMatchesSearch(s, search);
      const matchesFilter = !activeFilter || s.types.includes(activeFilter);
      const v = votes[s.name];
      const matchesVote =
        !voteFilter ||
        (voteFilter === "up" && v === "up") ||
        (voteFilter === "down" && v === "down") ||
        (voteFilter === "none" && !v);
      const isVisited = Boolean(visitedMap[s.name]);
      const matchesVisited =
        !visitedFilter ||
        (visitedFilter === "visited" && isVisited) ||
        (visitedFilter === "notVisited" && !isVisited);
      return matchesSearch && matchesFilter && matchesVote && matchesVisited;
    });

    return orderStationsForHome(matches, {
      distanceSortOn: sortByDistance,
      coords,
      globalRatings: globalVotes?.ratings,
      votesConfigured: Boolean(globalVotes?.configured && globalVotes.ratings),
    });
  }, [search, activeFilter, voteFilter, visitedFilter, votes, visitedMap, coords, sortByDistance, globalVotes]);

  const distanceByStation = useMemo(() => {
    if (!coords) return null;
    return stationDistancesKm(filtered, coords);
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
      <header className="relative overflow-hidden bg-primary px-4 py-12 text-primary-foreground md:px-6 md:py-28">
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
          <h1 className="mb-2 font-display text-3xl md:mb-4 md:text-5xl">
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
              <TrainFront className="h-7 w-7 shrink-0 md:h-8 md:w-8" aria-hidden="true" />
              {messages.site.name}
            </a>
          </h1>
          <div className="mt-2 flex flex-col gap-3 md:gap-4">
            <p className="max-w-2xl text-lg text-primary-foreground/90">
              Major CP stations from the Minho to the Algarve — with maps and
              budget hotels within walking distance.
            </p>
            <SitePageNavLinks variant="hero" className="self-start md:self-end" />
          </div>
        </div>
      </header>

      <StationFilters
        search={search}
        onSearchChange={setSearchQuery}
        trainTypes={allTypes}
        activeType={activeFilter}
        onTypeToggle={(type) => setActiveFilter(activeFilter === type ? null : type)}
        voteFilter={voteFilter}
        onVoteFilterToggle={(key) => setVoteFilter(voteFilter === key ? null : key)}
        visitedFilter={visitedFilter}
        onVisitedFilterToggle={(key) =>
          setVisitedFilter(visitedFilter === key ? null : key)
        }
        sortByDistance={sortByDistance}
        onRequestLocation={requestLocation}
        locationState={locationState}
        coords={coords}
      />

      {/* Grid */}
      <main className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
        <p className="mb-3 text-sm text-muted-foreground md:mb-4">
          {plural("home.stationCount", filtered.length, { count: filtered.length })}
          {coords
            ? t("home.sortedByDistanceNote")
            : sortByDistance && locationState.status === "loading"
              ? t("home.locating")
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
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
