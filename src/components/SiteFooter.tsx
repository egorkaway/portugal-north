import { CloudSun, ExternalLink, Languages, Smartphone } from "lucide-react";
import footerDouro from "@/assets/footer-douro.jpg";

export function SiteFooter({ showIntro = true }: { showIntro?: boolean }) {
  return (
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
        {showIntro && (
          <>
            <h2 className="font-display text-3xl md:text-4xl mb-3">
              Ride the rails of Portugal
            </h2>
            <p className="text-primary-foreground/90 max-w-xl mx-auto mb-6">
              From the misty Douro Valley to the Atlantic coast, with key stops and a place to
              sleep nearby.
            </p>
            <p className="text-primary-foreground/70 text-sm">
              We do not recommend these hotels, but if you do, we want to know.
            </p>
          </>
        )}

        <div className={showIntro ? "mt-10 pt-8 border-t border-primary-foreground/20" : ""}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
            Also from us
          </p>
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  Weather and meteorological alerts across Spain and Portugal. Check conditions
                  before you travel.
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
                  GetMapa's iPhone app tracks the places you visit and builds a personal travel
                  map from your trips and photos.
                </p>
              </div>
              <ExternalLink
                className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                aria-hidden="true"
              />
            </a>
            <a
              href="https://portuguess.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-5 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15"
            >
              <Languages className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl text-primary-foreground">PortuGuess</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Learn European Portuguese with quizzes, word lists, and offline apps for iOS and
                  Android.
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
  );
}
