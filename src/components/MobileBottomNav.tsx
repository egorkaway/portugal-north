import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleProvider";
import { isHomePath } from "@/lib/homeRoute";
import { useActiveTrip } from "@/lib/plannedDepartures";
import { BarChart3, Home, Map as MapIcon, Ticket, TrainFront } from "lucide-react";
import { useLocation } from "react-router-dom";

function NavItem({
  to,
  label,
  icon: Icon,
  highlight = false,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  highlight?: boolean;
}) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
          isActive
            ? "bg-foreground/5 text-primary"
            : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
        )
      }
    >
      {highlight ? (
        <span className="absolute right-3 top-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      ) : null}
      <Icon
        className="h-5 w-5 transition-transform group-active:scale-[0.98]"
        aria-hidden="true"
      />
      <span className="max-w-full truncate">{label}</span>
    </NavLink>
  );
}

function HomeNavItem({ label }: { label: string }) {
  const location = useLocation();
  const active = isHomePath(location.pathname);

  return (
    <NavLink
      to="/pt"
      aria-label={label}
      className={({ isPending }) =>
        cn(
          "group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
          active
            ? "bg-foreground/5 text-primary"
            : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
          isPending && "opacity-70",
        )
      }
    >
      <Home
        className="h-5 w-5 transition-transform group-active:scale-[0.98]"
        aria-hidden="true"
      />
      <span className="max-w-full truncate">{label}</span>
    </NavLink>
  );
}

/** Mobile-only bottom navigation (home, trip, rankings, tickets, map). */
export function MobileBottomNav() {
  const { t } = useLocale();
  const activeTrip = useActiveTrip();

  return (
    <nav
      className={cn(
        // iOS-like tab bar: frosted background + top hairline + subtle shadow
        "fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70",
        "shadow-[0_-8px_24px_rgba(0,0,0,0.08)]",
        "sm:hidden",
      )}
      aria-label={t("nav.mobile")}
    >
      <div className="mx-auto max-w-5xl px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] pt-2">
        <div className="flex items-stretch justify-between gap-2">
          <HomeNavItem label={t("nav.home")} />
          <NavItem
            to="/trip"
            label={t("nav.trip")}
            icon={TrainFront}
            highlight={Boolean(activeTrip)}
          />
          <NavItem to="/rankings" label={t("nav.rankings")} icon={BarChart3} />
          <NavItem to="/tickets" label={t("nav.tickets")} icon={Ticket} />
          <NavItem to="/map" label={t("nav.map")} icon={MapIcon} />
        </div>
      </div>
    </nav>
  );
}

