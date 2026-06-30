import { useLocale } from "@/i18n/LocaleProvider";
import { attributionForImageUrl } from "@/lib/imageAttribution";

type StationImageCreditProps = {
  imageUrl: string;
};

export function StationImageCredit({ imageUrl }: StationImageCreditProps) {
  const { t } = useLocale();
  const author = attributionForImageUrl(imageUrl).creator;

  if (author["@type"] !== "Person") {
    return null;
  }

  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      {t("station.photoCreditBy", { author: author.name })}
    </p>
  );
}
