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

  const heroDesktopPanel =
    variant === "hero"
      ? "md:rounded-xl md:bg-primary-foreground md:p-1.5 md:shadow-lg md:ring-1 md:ring-black/10"
      : "md:rounded-xl md:border md:border-border md:bg-muted/60 md:p-1.5 md:shadow-sm";

  return (
    <nav
      className={cn("hidden items-center sm:flex", heroDesktopPanel, className)}
      aria-label={t("nav.main")}
    >
      <div className="flex items-center gap-1 md:gap-1.5">
        {links.map(({ key, to, label, icon: Icon }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors md:px-3.5 md:py-1.5 md:text-sm",
                variant === "hero"
                  ? isActive
                    ? "bg-primary-foreground text-primary md:bg-primary md:text-primary-foreground md:shadow-sm"
                    : "border border-primary-foreground/35 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 md:border-transparent md:bg-muted md:text-foreground md:hover:bg-muted/80"
                  : isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-muted md:bg-background",
              )
            }
          >
            <Icon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
