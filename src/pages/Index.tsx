import { useState } from "react";
import { stations } from "@/data/stations";
import { StationCard } from "@/components/StationCard";
import { Search, TrainFront } from "lucide-react";
import heroStation from "@/assets/hero-station.jpg";
import footerDouro from "@/assets/footer-douro.jpg";

const allTypes = [...new Set(stations.flatMap((s) => s.types))];

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = stations.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.lines.some((l) => l.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = !activeFilter || s.types.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative text-primary-foreground py-24 md:py-32 px-6 overflow-hidden">
        <img
          src={heroStation}
          alt="Historic Portuguese train station at golden hour with azulejo tiles"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <TrainFront className="w-8 h-8" />
            <h1 className="font-display text-4xl md:text-5xl">
              Portugal North Stations
            </h1>
          </div>
          <p className="text-primary-foreground/90 text-lg max-w-2xl">
            Find maps and affordable hotels near every major train station from
            Pombal to Valença.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search station or line..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
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
      </div>

      {/* Grid */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} station{filtered.length !== 1 && "s"} · Click
          "Hotels on Booking" to find the 3 cheapest rooms within 2 km
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((station) => (
            <StationCard key={station.name} station={station} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No stations match your search.
          </p>
        )}
      </main>

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
            Ride the rails of the north
          </h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-6">
            From the misty Douro Valley to the Atlantic coast — every station
            here links you to maps and a place to sleep.
          </p>
          <p className="text-primary-foreground/70 text-sm">
            We do not recommend these hotels, but if you do — we want to know.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
