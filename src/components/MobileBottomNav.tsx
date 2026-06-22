import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleProvider";
import { BarChart3, Home, Map as MapIcon, Ticket } from "lucide-react";

function NavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: typeof Home;
}) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          // iOS-like tab item: centered icon + label, with a soft active pill
          "group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
          isActive
            ? "bg-foreground/5 text-primary"
            : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
        )
      }
    >
      <Icon
        className="h-5 w-5 transition-transform group-active:scale-[0.98]"
        aria-hidden="true"
      />
      <span className="max-w-full truncate">{label}</span>
    </NavLink>
  );
}

/** Mobile-only bottom navigation (home, rankings, tickets, map). */
export function MobileBottomNav() {
  const { t } = useLocale();

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
          <NavItem to="/" label={t("nav.home")} icon={Home} />
          <NavItem to="/rankings" label={t("nav.rankings")} icon={BarChart3} />
          <NavItem to="/tickets" label={t("nav.tickets")} icon={Ticket} />
          <NavItem to="/map" label={t("nav.map")} icon={MapIcon} />
        </div>
      </div>
    </nav>
  );
}

