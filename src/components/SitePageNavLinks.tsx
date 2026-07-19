import { BarChart3, Map, Route, Ticket } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type SitePageNavLinksProps = {
  className?: string;
  /** Light pills on a primary/hero background, or default on page content. */
  variant?: "hero" | "surface";
  /** Hide links for the current section (e.g. on the rankings page). */
  hide?: Array<"rankings" | "tickets" | "map" | "lines">;
};

/** Desktop-only shortcuts to Rankings and Tickets (mobile uses the bottom tab bar). */
export function SitePageNavLinks({
  className,
  variant = "surface",
  hide = [],
}: SitePageNavLinksProps) {
  const { t } = useLocale();

  const links = [
    { key: "rankings" as const, to: "/rankings", label: t("nav.rankings"), icon: BarChart3 },
    { key: "map" as const, to: "/map", label: t("nav.map"), icon: Map },
    { key: "lines" as const, to: "/lines", label: t("nav.lines"), icon: Route },
    { key: "tickets" as const, to: "/tickets", label: t("nav.tickets"), icon: Ticket },
  ].filter((link) => !hide.includes(link.key));

  if (links.length === 0) return null;

  return (
    <nav
      className={cn(
        "hidden items-center sm:flex",
        variant === "hero" &&
          "rounded-xl border border-border/80 bg-card p-1.5 shadow-md ring-1 ring-black/5 dark:ring-white/10",
        variant === "surface" &&
          "rounded-xl border border-border bg-muted/50 p-1.5 shadow-sm",
        className,
      )}
      aria-label={t("nav.main")}
    >
      <div className="flex items-center gap-1.5">
        {links.map(({ key, to, label, icon: Icon }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-transparent bg-muted text-foreground hover:bg-muted/70",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
