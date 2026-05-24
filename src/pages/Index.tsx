import { useMemo, useState } from "react";
import { stations } from "@/data/stations";
import { StationCard } from "@/components/StationCard";
import { StationRankings } from "@/components/StationRankings";
import {
  Search,
  TrainFront,
  ThumbsUp,
  ThumbsDown,
  Circle,
  CloudSun,
  Smartphone,
  ExternalLink,
  Navigation,
} from "lucide-react";
import heroStation from "@/assets/hero-station.jpg";
import footerDouro from "@/assets/footer-douro.jpg";
import { useAllVotes } from "@/hooks/useStationVote";
import { useUserLocation } from "@/hooks/useUserLocation";
import { distanceKm } from "@/lib/geo";

const allTypes = [...new Set(stations.flatMap((s) => s.types))];

type VoteFilter = "up" | "down" | "none";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [voteFilter, setVoteFilter] = useState<VoteFilter | null>(null);
  const votes = useAllVotes();
  const { state: locationState, coords, isActive: sortByDistance, requestLocation } =
    useUserLocation();

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

    if (!coords) return matches;

    return [...matches].sort(
      (a, b) =>
        distanceKm(coords.lat, coords.lng, a.lat, a.lng) -
        distanceKm(coords.lat, coords.lng, b.lat, b.lng),
    );
  }, [search, activeFilter, voteFilter, votes, coords]);

  const distanceByStation = useMemo(() => {
    if (!coords) return null;
    return Object.fromEntries(
      filtered.map((station) => [
        station.name,
        distanceKm(coords.lat, coords.lng, station.lat, station.lng),
      ]),
    );
  }, [filtered, coords]);

  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex items-center gap-3 mb-4">
            <TrainFront className="w-8 h-8" />
            <h1 className="font-display text-4xl md:text-5xl">
              Portugal by Train
            </h1>
          </div>
          <p className="text-primary-foreground/90 text-lg max-w-2xl">
            Major CP stations from the Minho to the Algarve, with budget
            hotels within walking distance.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <label htmlFor="station-search" className="sr-only">
              Search station or line
            </label>
            <input
              id="station-search"
              type="search"
              aria-label="Search station or line"
              placeholder="Search station or line..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={requestLocation}
              disabled={locationState.status === "loading"}
              aria-pressed={sortByDistance}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                sortByDistance
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {locationState.status === "loading"
                ? "Locating..."
                : sortByDistance
                  ? "Near me"
                  : "Sort by distance"}
            </button>
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
          <span className="text-xs text-muted-foreground mr-1">Your votes:</span>
          {([
            { key: "up" as const, label: "Upvoted", Icon: ThumbsUp },
            { key: "down" as const, label: "Downvoted", Icon: ThumbsDown },
            { key: "none" as const, label: "Not voted yet", Icon: Circle },
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
          {filtered.length} station{filtered.length !== 1 && "s"}
          {sortByDistance ? " · Sorted by distance from you" : ""}
          {locationState.status === "denied"
            ? " · Location access denied"
            : locationState.status === "unsupported"
              ? " · Location not supported in this browser"
              : locationState.status === "error"
                ? " · Could not get your location"
                : ""}
          {!sortByDistance && " · Click \"Hotels on Booking\" to find the 3 cheapest rooms within 2 km"}
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
            No stations match your search.
          </p>
        )}
      </main>

      <StationRankings />

      {/* Footer */}
      <footer className="relative mt-12 text-primary-foreground overflow-hidden">
        <img
          src={footerDouro}
          alt="Railway tracks winding through the Douro Valley vineyards"
          width={1920}
          height={768}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            Ride the rails of Portugal
          </h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-6">
            From the misty Douro Valley to the Atlantic coast, with key stops and
            a place to sleep nearby.
          </p>
          <p className="text-primary-foreground/70 text-sm">
            We do not recommend these hotels, but if you do, we want to know.
          </p>

          <div className="mt-10 pt-8 border-t border-primary-foreground/20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
              Also from us
            </p>
            <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch">
              <a
                href="https://berrymet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-start gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-5 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15"
              >
                <CloudSun className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-primary-foreground">Clima Ibérico</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    Weather and meteorological alerts across Spain and Portugal.
                    Check conditions before you travel.
                  </p>
                </div>
                <ExternalLink
                  className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                  aria-hidden="true"
                />
              </a>
              <a
                href="https://getmapa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-start gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-5 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15"
              >
                <Smartphone className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-primary-foreground">Map Your Travel</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    GetMapa's iPhone app tracks the places you visit and builds a
                    personal travel map from your trips and photos.
                  </p>
                </div>
                <ExternalLink
                  className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
