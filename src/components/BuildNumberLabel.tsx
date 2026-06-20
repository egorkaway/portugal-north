import { useQuery } from "@tanstack/react-query";
import { fetchBuildInfo } from "@/lib/buildInfo";
import { useLocale } from "@/i18n/LocaleProvider";

export function BuildNumberLabel() {
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
    <p className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
      {t("rankings.buildInfo", { buildNumber: data.buildNumber })}
    </p>
  );
}
