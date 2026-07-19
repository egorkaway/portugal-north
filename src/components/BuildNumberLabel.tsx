import { useQuery } from "@tanstack/react-query";
import { fetchBuildInfo } from "@/lib/buildInfo";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type BuildNumberLabelProps = {
  className?: string;
};

export function BuildNumberLabel({ className }: BuildNumberLabelProps) {
  const { t } = useLocale();
  const { data } = useQuery({
    queryKey: ["build-info"],
    queryFn: fetchBuildInfo,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  if (!data || data.buildNumber === "0") return null;

  return (
    <p
      className={cn(
        "mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground",
        className,
      )}
    >
      {t("rankings.buildInfo", { buildNumber: data.buildNumber })}
    </p>
  );
}
