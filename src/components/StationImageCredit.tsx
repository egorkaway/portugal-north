import { useLocale } from "@/i18n/LocaleProvider";
import { attributionForImageUrl } from "@/lib/imageAttribution";

type StationImageCreditProps = {
  imageUrl: string;
};

export function StationImageCredit({ imageUrl }: StationImageCreditProps) {
  const { t } = useLocale();
  const attribution = attributionForImageUrl(imageUrl);
  const author = attribution.creator;

  if (author["@type"] !== "Person" || !attribution.sourceName) {
    return null;
  }

  const isPexels = attribution.sourceName === "Pexels";
  const beforeKey = isPexels
    ? "station.photoCreditPexelsBefore"
    : "station.photoCreditWikimediaBefore";
  const afterKey = isPexels
    ? "station.photoCreditPexelsAfter"
    : "station.photoCreditWikimediaAfter";

  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      {t(beforeKey)}{" "}
      {attribution.authorUrl ? (
        <a
          href={attribution.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          {author.name}
        </a>
      ) : (
        <span className="font-medium text-foreground">{author.name}</span>
      )}{" "}
      {t(afterKey)}{" "}
      {attribution.sourceUrl ? (
        <a
          href={attribution.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          {attribution.sourceName}
        </a>
      ) : (
        attribution.sourceName
      )}
    </p>
  );
}
