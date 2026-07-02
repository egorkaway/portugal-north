import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageHead } from "@/components/PageHead";
import { getNotFoundPageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { defaultHomePath } from "@/lib/homeRoute";

const NotFound = () => {
  const { t, locale } = useLocale();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHead meta={getNotFoundPageMeta(locale)} />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">{t("notFound.title")}</h1>
          <p className="mb-4 text-xl text-muted-foreground">{t("notFound.message")}</p>
          <a href={defaultHomePath()} className="text-primary underline hover:text-primary/90">
            {t("notFound.home")}
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
