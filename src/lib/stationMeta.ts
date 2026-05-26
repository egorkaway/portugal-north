import type { Hotel } from "@/data/hotels";
import type { Station } from "@/data/stations";
import type { Locale, Translator } from "@/i18n";

const MAX_DESCRIPTION = 158;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function conjunction(locale: Locale): string {
  if (locale === "pt" || locale === "gl") return "e";
  if (locale === "es") return "y";
  if (locale === "ca") return "i";
  return "and";
}

export function formatLineList(lines: string[], locale: Locale): string {
  if (lines.length === 0) return "";
  if (lines.length === 1) return lines[0];
  if (lines.length === 2) return `${lines[0]} ${conjunction(locale)} ${lines[1]}`;
  const and = conjunction(locale);
  return `${lines.slice(0, -1).join(", ")}, ${and} ${lines[lines.length - 1]}`;
}

export function formatServiceTypes(types: string[], locale: Locale): string {
  const active = types.filter((type) => type !== "Inactive / Historic");
  if (active.length === 0) return "";
  if (active.length <= 3) return active.join(", ");
  const more =
    locale === "pt"
      ? "e mais"
      : locale === "gl"
        ? "e máis"
        : locale === "es"
          ? "y más"
          : locale === "ca"
            ? "i més"
            : "and more";
  return `${active.slice(0, 2).join(", ")}, ${more}`;
}

function hotelSummary(hotels: Hotel[], tr: Translator): string {
  if (hotels.length === 0) return tr.t("meta.mapsVotes");
  const minPrice = Math.min(...hotels.map((h) => h.priceFrom));
  const countLabel =
    hotels.length === 1
      ? tr.t("meta.budgetStay_one")
      : tr.t("meta.budgetStay_other", { count: hotels.length });
  return `${countLabel} ${tr.t("meta.fromPerNight", { price: minPrice })}`;
}

export function getStationPageTitle(station: Station, tr: Translator): string {
  return tr.t("meta.stationTitle", {
    name: station.name,
    site: tr.t("meta.siteName"),
  });
}

export function getStationMetaDescription(
  station: Station,
  hotels: Hotel[],
  tr: Translator,
): string {
  const services = formatServiceTypes(station.types, tr.locale) || tr.t("meta.cpTrains");
  const lines = formatLineList(station.lines, tr.locale) || tr.t("meta.cpNetwork");
  const stays = hotelSummary(hotels, tr);
  return truncate(
    tr.t("meta.stationDescription", { services, name: station.name, lines, stays }),
    MAX_DESCRIPTION,
  );
}

export function getStationOgDescription(
  station: Station,
  hotels: Hotel[],
  tr: Translator,
): string {
  const services = formatServiceTypes(station.types, tr.locale) || tr.t("meta.cpTrains");
  const lines = formatLineList(station.lines, tr.locale) || tr.t("meta.cpNetwork");

  if (hotels.length === 0) {
    return truncate(
      tr.t("meta.stationOgNoHotels", { name: station.name, services, lines }),
      MAX_DESCRIPTION,
    );
  }

  const minPrice = Math.min(...hotels.map((h) => h.priceFrom));
  const names = hotels
    .slice(0, 2)
    .map((h) => h.name)
    .join(", ");
  const more =
    hotels.length > 2 ? tr.t("meta.andMore", { count: hotels.length - 2 }) : "";

  return truncate(
    tr.t("meta.stationOgWithHotels", {
      name: station.name,
      lines,
      services,
      price: minPrice,
      names,
      more,
    }),
    MAX_DESCRIPTION,
  );
}
