import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationListPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const { t } = useLocale();

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={t("home.paginationLabel")}
      className={cn("mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center", className)}
    >
      <p className="text-sm text-muted-foreground sm:order-2 sm:px-4">
        {t("home.pageOfBefore", { current: currentPage })}{" "}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label={t("home.goToLastPage", { page: totalPages })}
          className={cn(
            "rounded-sm font-medium tabular-nums underline-offset-2",
            currentPage >= totalPages
              ? "cursor-default font-normal"
              : "text-foreground underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {totalPages}
        </button>
      </p>
      <div className="flex w-full items-center justify-center gap-2 sm:order-1 sm:w-auto">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-1")}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t("home.previousPage")}
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-1")}
        >
          {t("home.nextPage")}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
