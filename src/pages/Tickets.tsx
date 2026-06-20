import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { useLocale } from "@/i18n/LocaleProvider";
import { getTicketsPageMeta } from "@/lib/pageMeta";
import { ArrowLeft, CreditCard, Globe, Layers, Smartphone, Ticket, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";

const CP_WEBSITE_URL = "https://www.cp.pt/";
const CP_APP_IOS_URL = "https://apps.apple.com/app/comboios-de-portugal/id1105415627";
const CP_APP_ANDROID_URL = "https://play.google.com/store/apps/details?id=pt.cp.mobiapp";
const ANDANTE_URL = "https://www.andante.pt/";
const METRO_PORTO_TARIFFS_URL = "https://www.metrodoporto.pt/pt/viajar/tarifarios";
const NAVEGANTE_URL = "https://www.navegante.pt/";
const METRO_LISBOA_TARIFFS_URL = "https://www.metrolisboa.pt/pt/comprar/tarifario";

const Tickets = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead meta={getTicketsPageMeta(locale)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.backToStations")}
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <h1 className="truncate font-display text-2xl md:text-4xl">{t("tickets.title")}</h1>
                  <p className="mt-1 text-sm text-primary-foreground/85">{t("tickets.subtitle")}</p>
                </div>
              </div>
              <SitePageNavLinks variant="hero" hide={["tickets"]} className="shrink-0" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <div className="space-y-8">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold md:text-xl">{t("tickets.howToBuyTitle")}</h2>
              <p className="text-muted-foreground">{t("tickets.howToBuyIntro")}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("tickets.buyOnlineTitle")}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyOnlineBody")}</p>
                  <p className="mt-2">
                    <a
                      href={CP_WEBSITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                    >
                      {t("tickets.buyOnlineLink")}
                    </a>
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Smartphone className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("tickets.buyInAppTitle")}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyInAppBody")}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <a
                      href={CP_APP_IOS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                    >
                      {t("tickets.buyInAppIos")}
                    </a>
                    <a
                      href={CP_APP_ANDROID_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                    >
                      {t("tickets.buyInAppAndroid")}
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Ticket className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("tickets.buyAtStationTitle")}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyAtStationBody")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyOnboardNote")}</p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold md:text-xl">{t("tickets.pricesTitle")}</h2>
              <p className="text-muted-foreground">{t("tickets.pricesIntro")}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <TrainFront className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("tickets.serviceTypesTitle")}
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>{t("tickets.serviceAP")}</li>
                    <li>{t("tickets.serviceIC")}</li>
                    <li>{t("tickets.serviceR")}</li>
                    <li>{t("tickets.serviceU")}</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("tickets.moneySavingTitle")}
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>{t("tickets.tipAdvance")}</li>
                    <li>{t("tickets.tipFlexibility")}</li>
                    <li>{t("tickets.tipRailPass")}</li>
                    <li>{t("tickets.tipUrban")}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                {t("tickets.disclaimer")}
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold md:text-xl">{t("tickets.metroTitle")}</h2>
              <p className="text-muted-foreground">{t("tickets.metroIntro")}</p>
              <p className="text-sm text-muted-foreground">{t("tickets.metroCombineNote")}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-violet-600/20 bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Layers className="h-4 w-4 text-violet-600" aria-hidden="true" />
                    {t("tickets.metroPortoTitle")}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroPortoBody")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroPortoZones")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroPortoTips")}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={ANDANTE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                    >
                      {t("tickets.metroPortoAndanteLink")}
                    </a>
                    <a
                      href={METRO_PORTO_TARIFFS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                    >
                      {t("tickets.metroPortoTariffsLink")}
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border border-violet-600/20 bg-card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Layers className="h-4 w-4 text-violet-600" aria-hidden="true" />
                    {t("tickets.metroLisboaTitle")}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroLisboaBody")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroLisboaZones")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroLisboaTips")}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={NAVEGANTE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                    >
                      {t("tickets.metroLisboaNaveganteLink")}
                    </a>
                    <a
                      href={METRO_LISBOA_TARIFFS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                    >
                      {t("tickets.metroLisboaTariffsLink")}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                {t("tickets.metroDisclaimer")}
              </div>
            </section>
          </div>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Tickets;

