import { Link } from "react-router-dom";
import { ExternalLink, Footprints, Languages, Smartphone } from "lucide-react";
import footerDouro from "@/assets/footer-douro.jpg";
import { BuildNumberLabel } from "@/components/BuildNumberLabel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";
import { useFooterCountry } from "@/hooks/useFooterCountry";
import type { CountryCode } from "@/lib/countries";

export function SiteFooter({
  showIntro = true,
  country: countryOverride,
}: {
  showIntro?: boolean;
  country?: CountryCode;
}) {
  const { t } = useLocale();
  const country = useFooterCountry(countryOverride);

  return (
    <footer className="relative mt-8 overflow-hidden text-primary-foreground md:mt-12">
      <img
        src={footerDouro}
        alt=""
        width={1920}
        height={768}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
      <div className="relative mx-auto max-w-5xl px-4 py-10 text-center md:px-6 md:py-16">
        {showIntro && (
          <>
            <h2 className="font-display text-3xl md:text-4xl mb-3">{t("footer.title")}</h2>
            <p className="text-primary-foreground/90 max-w-xl mx-auto mb-6">
              {t("footer.subtitle")}
            </p>
            <p className="text-primary-foreground/70 text-sm">{t("footer.disclaimer")}</p>
          </>
        )}

        <div
          className={
            showIntro
              ? "mt-6 space-y-6 border-t border-primary-foreground/20 pt-6 md:mt-10 md:space-y-10 md:pt-8"
              : "space-y-6 md:space-y-8"
          }
        >
          <LanguageSwitcher />

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
            <Link
              to="/lines"
              className="underline underline-offset-4 transition-colors hover:text-primary-foreground"
            >
              {t("nav.lines")}
            </Link>
            <Link
              to="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-primary-foreground"
            >
              {t("footer.privacy")}
            </Link>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
              {t("footer.alsoFromUs")}
            </p>
            <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="https://apps.apple.com/pt/app/my-personal-camino-de-santiago/id6761839093?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
              >
                <Footprints className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-primary-foreground">
                    {t("footer.caminoTitle")}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{t("footer.caminoDesc")}</p>
                </div>
                <ExternalLink
                  className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                  aria-hidden="true"
                />
              </a>
              <a
                href="https://getmapa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
              >
                <Smartphone className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-primary-foreground">
                    {t("footer.mapaTitle")}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{t("footer.mapaDesc")}</p>
                </div>
                <ExternalLink
                  className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                  aria-hidden="true"
                />
              </a>
              {country === "es" ? (
                <a
                  href="https://sovnik.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
                >
                  <Languages className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl text-primary-foreground">
                      {t("footer.sovnikTitle")}
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">{t("footer.sovnikDesc")}</p>
                  </div>
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <a
                  href="https://portuguess.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
                >
                  <Languages className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl text-primary-foreground">
                      {t("footer.portuGuessTitle")}
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                      {t("footer.portuGuessDesc")}
                    </p>
                  </div>
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>

          <BuildNumberLabel className="mt-2 border-0 pt-0 text-primary-foreground/50" />
        </div>
      </div>
    </footer>
  );
}
