import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { useLocale } from "@/i18n/LocaleProvider";
import { getTicketsPageMeta } from "@/lib/pageMeta";
import { ArrowLeft, CreditCard, Globe, Smartphone, Ticket, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";

const CP_WEBSITE_URL = "https://www.cp.pt/";
const CP_APP_IOS_URL = "https://apps.apple.com/app/comboios-de-portugal/id1105415627";
const CP_APP_ANDROID_URL = "https://play.google.com/store/apps/details?id=pt.cp.mobiapp";

const Tickets = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead meta={getTicketsPageMeta(locale)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 md:px-6 md:py-8">
            <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl md:text-4xl">{t("tickets.title")}</h1>
              <p className="mt-1 text-sm text-primary-foreground/85">{t("tickets.subtitle")}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:mb-8"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("nav.backToStations")}
          </Link>

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
          </div>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Tickets;

