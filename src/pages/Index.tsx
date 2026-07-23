import { lazy, Suspense, useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStationsForHomeScope } from "@/data/stationRegistry";
import { StationCard } from "@/components/StationCard";
import { StationGridSkeleton } from "@/components/StationGridSkeleton";
import { StationListPagination } from "@/components/StationListPagination";
import { CountrySelectorBar } from "@/components/CountrySelector";
import { TrainFront } from "lucide-react";
import { StationFilters } from "@/components/StationFilters";
import heroStation from "@/assets/hero-station.jpg";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { buildHomeStructuredData } from "@/lib/structuredData";
import { PageHead } from "@/components/PageHead";
import { getHomePageMeta } from "@/lib/pageMeta";
import { useDismissStaticShell } from "@/components/AppShellFallback";
import { useLocale } from "@/i18n/LocaleProvider";
import { useGlobalStationRatings } from "@/hooks/useGlobalStationRatings";
import { useAllVotes } from "@/hooks/useStationVote";
import { useAllVisited } from "@/hooks/useStationVisited";
import { StationInteractionProvider } from "@/hooks/StationInteractionProvider";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useHomeRoute } from "@/hooks/useHomeRoute";
import { footerCountryFromHomeScope, type HomeScope } from "@/lib/countries";
import { buildHomePath, isHomePath, parseHomeCanonicalPath } from "@/lib/homeRoute";
import { orderStationsForHome, stationDistancesKm } from "@/lib/rankStations";
import { stationMatchesSearch } from "@/lib/searchText";
import { sortTrainTypes } from "@/lib/trainTypes";
import {
  normalizeStationTypeForFilter,
  stationMatchesTypeFilter,
} from "@/lib/airportTypes";
import { paginate } from "@/lib/paginate";
import NotFound from "@/pages/NotFound";

const StationRankings = lazy(() =>
  import("@/components/StationRankings").then((module) => ({
    default: module.StationRankings,
  })),
);
type VoteFilter = "up" | "down" | "none";
type VisitedFilter = "visited" | "notVisited";

function HomePage({ scope, currentPage }: { scope: HomeScope; currentPage: number }) {
  useDismissStaticShell();
  const { t, plural, locale, messages } = useLocale();
  const { searchQuery, setScope, setPage, setSearchQuery, goToFirstPage } = useHomeRoute(
    scope,
    currentPage,
  );
  const deferredScope = useDeferredValue(scope);
  const isSwitchingCountry = scope !== deferredScope;
  const countryStations = useMemo(
    () => getStationsForHomeScope(deferredScope),
    [deferredScope],
  );
  const allTypes = useMemo(
    () =>
      sortTrainTypes([
        ...new Set(
          countryStations.flatMap((s) => s.types.map(normalizeStationTypeForFilter)),
        ),
      ]),
    [countryStations],
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [voteFilter, setVoteFilter] = useState<VoteFilter | null>(null);
  const [visitedFilter, setVisitedFilter] = useState<VisitedFilter | null>(null);
  const stationListRef = useRef<HTMLDivElement>(null);

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

  const handleScopeChange = useCallback(
    (nextScope: HomeScope) => {
      setActiveFilter(null);
      setVoteFilter(null);
      setVisitedFilter(null);
      setScope(nextScope);
    },
    [setScope],
  );

  const heroSubtitle =
    scope === "es"
      ? t("home.heroSubtitleEs")
      : scope === "all"
        ? t("home.heroSubtitleAll")
        : t("home.heroSubtitle");

  const skeletonCount = scope === "es" ? 6 : scope === "all" ? 12 : 9;

  const filtered = useMemo(() => {
    const matches = countryStations.filter((s) => {
      const matchesSearch = stationMatchesSearch(s, searchQuery);
      const matchesFilter = stationMatchesTypeFilter(s, activeFilter);
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
  }, [
    countryStations,
    searchQuery,
    activeFilter,
    voteFilter,
    visitedFilter,
    votes,
    visitedMap,
    coords,
    sortByDistance,
    globalVotes,
  ]);

  const paginated = useMemo(
    () => paginate(filtered, currentPage),
    [filtered, currentPage],
  );

  const distanceByStation = useMemo(() => {
    if (!coords) return null;
    return stationDistancesKm(paginated.items, coords);
  }, [paginated.items, coords]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      stationListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [setPage],
  );

  const resetFiltersPage = useCallback(() => {
    goToFirstPage();
  }, [goToFirstPage]);

  return (
    <div className="min-h-screen bg-background">
      <PageHead meta={getHomePageMeta(locale, scope, currentPage)} />
      <JsonLd data={buildHomeStructuredData(scope)} />
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
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
            <div className="min-w-0">
              <h1 className="mb-2 font-display text-3xl tracking-tight hero-title-shadow md:mb-4 md:text-5xl lg:text-6xl lg:tracking-normal">
                <a
                  href={buildHomePath(scope)}
                  onClick={(e) => {
                    if (isHomePath(window.location.pathname)) {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                  className="group inline-flex items-center gap-3 text-primary-foreground no-underline transition-[opacity,gap] hover:gap-3.5 hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground md:gap-3.5"
                >
                  <TrainFront
                    className="h-7 w-7 shrink-0 transition-transform group-hover:scale-105 md:h-8 md:w-8 lg:h-9 lg:w-9"
                    aria-hidden="true"
                  />
                  <span className="flex flex-col gap-1.5 md:gap-2">
                    <span>{messages.site.name}</span>
                    <span
                      className="h-0.5 w-12 rounded-full bg-secondary transition-[width] group-hover:w-16 md:w-16 lg:w-20 lg:group-hover:w-24"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </h1>
              <p className="max-w-2xl text-lg text-primary-foreground/90">{heroSubtitle}</p>
            </div>
            <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
              <SitePageNavLinks variant="hero" className="self-end" />
              <CountrySelectorBar
                scope={scope}
                onScopeChange={handleScopeChange}
                variant="hero"
              />
            </div>
          </div>
        </div>
      </header>

      <StationFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        trainTypes={allTypes}
        activeType={activeFilter}
        onTypeToggle={(type) => {
          resetFiltersPage();
          setActiveFilter(activeFilter === type ? null : type);
        }}
        voteFilter={voteFilter}
        onVoteFilterToggle={(key) => {
          resetFiltersPage();
          setVoteFilter(voteFilter === key ? null : key);
        }}
        visitedFilter={visitedFilter}
        onVisitedFilterToggle={(key) => {
          resetFiltersPage();
          setVisitedFilter(visitedFilter === key ? null : key);
        }}
        sortByDistance={sortByDistance}
        onRequestLocation={requestLocation}
        locationState={locationState}
        coords={coords}
      />

      <StationInteractionProvider>
        <main className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
          <p className="mb-3 text-sm text-muted-foreground md:mb-4">
            {isSwitchingCountry
              ? t("home.switchingCountry")
              : plural("home.stationCount", paginated.total, { count: paginated.total })}
            {!isSwitchingCountry && paginated.totalPages > 1
              ? t("home.showingRange", {
                  from: paginated.rangeFrom,
                  to: paginated.rangeTo,
                  total: paginated.total,
                })
              : ""}
            {!isSwitchingCountry && coords
              ? t("home.sortedByDistanceNote")
              : !isSwitchingCountry && sortByDistance && locationState.status === "loading"
                ? t("home.locating")
                : !isSwitchingCountry && sortByCommunityVotes
                  ? t("home.topCommunityPicks")
                  : ""}
            {!isSwitchingCountry && locationState.status === "denied"
              ? t("home.locationDenied")
              : !isSwitchingCountry && locationState.status === "unsupported"
                ? t("home.locationUnsupported")
                : !isSwitchingCountry && locationState.status === "error"
                  ? t("home.locationError")
                  : ""}
            {!isSwitchingCountry && !sortByDistance && t("home.bookingHint")}
          </p>
          {isSwitchingCountry ? (
            <StationGridSkeleton count={skeletonCount} />
          ) : (
            <div ref={stationListRef} id="station-list">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {paginated.items.map((station) => (
                  <StationCard
                    key={station.name}
                    station={station}
                    distanceKm={distanceByStation?.[station.name]}
                  />
                ))}
              </div>
              <StationListPagination
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
          {!isSwitchingCountry && paginated.total === 0 && (
            <p className="text-center text-muted-foreground py-16">
              {t("home.noResults")}
            </p>
          )}
          <CountrySelectorBar
            scope={scope}
            onScopeChange={handleScopeChange}
            className="mt-6 sm:hidden"
          />
        </main>
      </StationInteractionProvider>

      <Suspense fallback={null}>
        <StationRankings />
      </Suspense>

      <SiteFooter country={footerCountryFromHomeScope(scope)} />
    </div>
  );
}

const Index = () => {
  const location = useLocation();
  const home = parseHomeCanonicalPath(location.pathname);

  if (!home) {
    return <NotFound />;
  }

  const { scope, page } = home;
  if (page < 1) {
    return <Navigate to={buildHomePath(scope)} replace />;
  }
  if (/\/(pt|es|all)\/1$/.test(location.pathname)) {
    return <Navigate to={buildHomePath(scope)} replace />;
  }

  return <HomePage scope={scope} currentPage={page} />;
};

export default Index;
