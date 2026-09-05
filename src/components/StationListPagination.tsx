import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationListPagination({
  currentPage,
  totalPages,
  hrefForPage,
  variant = "block",
  className,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  variant?: "block" | "inline";
  className?: string;
}) {
  const { t } = useLocale();

  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const compact = variant === "inline";

  return (
    <nav
      aria-label={t("home.paginationLabel")}
      className={cn(
        compact
          ? "flex items-center gap-2"
          : "mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center",
        className,
      )}
    >
      {!compact ? (
        <p className="text-sm text-muted-foreground sm:order-2 sm:px-4">
          {t("home.pageOfBefore", { current: currentPage })}{" "}
          {nextDisabled ? (
            <span className="font-normal tabular-nums">{totalPages}</span>
          ) : (
            <Link
              to={hrefForPage(totalPages)}
              aria-label={t("home.goToLastPage", { page: totalPages })}
              className="rounded-sm font-medium tabular-nums text-foreground underline underline-offset-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {totalPages}
            </Link>
          )}
        </p>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2",
          !compact && "w-full justify-center sm:order-1 sm:w-auto",
        )}
      >
        {prevDisabled ? (
          <span
            aria-disabled="true"
            className={cn(
              buttonVariants({ variant: "outline", size: compact ? "sm" : "default" }),
              "pointer-events-none gap-1 opacity-50",
            )}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {t("home.previousPage")}
          </span>
        ) : (
          <Link
            to={hrefForPage(currentPage - 1)}
            rel="prev"
            className={cn(
              buttonVariants({ variant: "outline", size: compact ? "sm" : "default" }),
              "gap-1",
            )}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {t("home.previousPage")}
          </Link>
        )}
        {nextDisabled ? (
          <span
            aria-disabled="true"
            className={cn(
              buttonVariants({ variant: "outline", size: compact ? "sm" : "default" }),
              "pointer-events-none gap-1 opacity-50",
            )}
          >
            {t("home.nextPage")}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <Link
            to={hrefForPage(currentPage + 1)}
            rel="next"
            className={cn(
              buttonVariants({ variant: "outline", size: compact ? "sm" : "default" }),
              "gap-1",
            )}
          >
            {t("home.nextPage")}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}
