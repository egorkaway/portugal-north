import { BarChart3, Ticket } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type SitePageNavLinksProps = {
  className?: string;
  /** Light pills on a primary/hero background, or default on page content. */
  variant?: "hero" | "surface";
  /** Hide links for the current section (e.g. on the rankings page). */
  hide?: Array<"rankings" | "tickets">;
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
    { key: "tickets" as const, to: "/tickets", label: t("nav.tickets"), icon: Ticket },
  ].filter((link) => !hide.includes(link.key));

  if (links.length === 0) return null;

  return (
    <nav
      className={cn("hidden flex-wrap items-center gap-2 sm:flex", className)}
      aria-label={t("nav.main")}
    >
      {links.map(({ key, to, label, icon: Icon }) => (
        <NavLink
          key={key}
          to={to}
          className={({ isActive }) =>
            cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              variant === "hero"
                ? isActive
                  ? "bg-primary-foreground text-primary shadow-sm"
                  : "border border-primary-foreground/35 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25"
                : isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-foreground hover:bg-muted",
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
