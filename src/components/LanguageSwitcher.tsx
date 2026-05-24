import { useLocale } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/types";

const OPTIONS: { value: Locale; labelKey: "en" | "pt" | "es" }[] = [
  { value: "en", labelKey: "en" },
  { value: "pt", labelKey: "pt" },
  { value: "es", labelKey: "es" },
];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="group"
      aria-label={t("lang.label")}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
        {t("lang.label")}
      </p>
      <div className="inline-flex rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 p-0.5 backdrop-blur-sm">
        {OPTIONS.map(({ value, labelKey }) => {
          const active = locale === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setLocale(value)}
              aria-pressed={active}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-foreground text-primary shadow-sm"
                  : "text-primary-foreground/85 hover:bg-primary-foreground/15 hover:text-primary-foreground"
              }`}
            >
              {t(`lang.${labelKey}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
