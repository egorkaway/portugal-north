import { Euro, ExternalLink, Navigation, Store } from "lucide-react";
import type { Hotel } from "@/data/hotels";
import { useHotelClosedReport } from "@/hooks/useHotelClosedReport";
import { useHotelVote } from "@/hooks/useHotelVote";
import { VoteButtons } from "@/components/VoteButtons";
import { useLocale } from "@/i18n/LocaleProvider";

function HotelPrice({ priceFrom }: { priceFrom: number }) {
  const { t } = useLocale();
  const fullLabel = t("station.priceStartsAt", { price: priceFrom });

  return (
    <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-primary">
      <span className="inline-flex items-center gap-0.5 md:hidden" aria-label={fullLabel}>
        <Euro className="h-3 w-3 shrink-0" aria-hidden="true" />
        {priceFrom}
      </span>
      <span className="hidden text-xs font-semibold md:inline md:text-sm">{fullLabel}</span>
    </span>
  );
}

function HotelClosedSuggestion({ stationName, hotelName }: { stationName: string; hotelName: string }) {
  const { t } = useLocale();
  const { reported, toggle } = useHotelClosedReport(stationName, hotelName);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reported}
      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
        reported
          ? "text-destructive hover:text-destructive/80"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Store className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {reported ? t("station.suggestedClosed") : t("station.suggestClosed")}
    </button>
  );
}

function HotelRowCompactLink({ hotel }: { hotel: Hotel }) {
  return (
    <a
      href={hotel.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start justify-between gap-2 rounded-md p-2 -mx-2 hover:bg-accent/50 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{hotel.name}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Navigation className="h-3 w-3 shrink-0" aria-hidden="true" />
          {t("station.kmFromStation", { km: hotel.distanceKm })}
        </p>
      </div>
      <HotelPrice priceFrom={hotel.priceFrom} />
    </a>
  );
}

function HotelRowCompactWithVotes({
  stationName,
  hotel,
}: {
  stationName: string;
  hotel: Hotel;
}) {
  const { t } = useLocale();
  const { vote, cast } = useHotelVote(stationName, hotel.name);

  return (
    <li>
      <div className="flex items-start gap-2 rounded-md p-2 -mx-2 hover:bg-accent/50 transition-colors">
        <a
          href={hotel.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1"
        >
          <p className="text-sm font-medium text-foreground truncate">{hotel.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Navigation className="h-3 w-3 shrink-0" aria-hidden="true" />
            {t("station.kmFromStation", { km: hotel.distanceKm })}
          </p>
        </a>
        <HotelPrice priceFrom={hotel.priceFrom} />
        <VoteButtons
          vote={vote}
          onUp={() => cast("up")}
          onDown={() => cast("down")}
          subjectLabel={hotel.name}
        />
      </div>
    </li>
  );
}

function HotelRowCompact({
  stationName,
  hotel,
  showVoteButtons,
}: {
  stationName: string;
  hotel: Hotel;
  showVoteButtons: boolean;
}) {
  if (showVoteButtons) {
    return <HotelRowCompactWithVotes stationName={stationName} hotel={hotel} />;
  }

  return (
    <li>
      <HotelRowCompactLink hotel={hotel} />
    </li>
  );
}

function HotelRow({ stationName, hotel }: { stationName: string; hotel: Hotel }) {
  const { t } = useLocale();
  const { vote, cast } = useHotelVote(stationName, hotel.name);

  return (
    <li className="flex items-start gap-3 rounded-md border border-border bg-card p-3 md:p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium text-foreground">{hotel.name}</p>
          <HotelPrice priceFrom={hotel.priceFrom} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
          <Navigation className="w-3 h-3 shrink-0" aria-hidden="true" />
          {t("station.kmFromStation", { km: hotel.distanceKm })}
        </p>
        <div className="mt-2 flex flex-col gap-3 md:mt-3 md:gap-4">
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t("station.viewOnBooking")}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <HotelClosedSuggestion stationName={stationName} hotelName={hotel.name} />
        </div>
      </div>
      <VoteButtons
        vote={vote}
        onUp={() => cast("up")}
        onDown={() => cast("down")}
        subjectLabel={hotel.name}
      />
    </li>
  );
}

export function HotelList({
  stationName,
  hotels,
  variant = "full",
  showVoteButtons,
}: {
  stationName: string;
  hotels: Hotel[];
  variant?: "full" | "compact";
  /** Defaults to true on station pages (full), false on homepage cards (compact). */
  showVoteButtons?: boolean;
}) {
  const { t } = useLocale();
  const votesVisible = showVoteButtons ?? variant === "full";
  if (hotels.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("station.noHotels")}</p>
    );
  }

  if (variant === "compact") {
    return (
      <ul className="space-y-2">
        {hotels.map((hotel) => (
          <HotelRowCompact
            key={hotel.name}
            stationName={stationName}
            hotel={hotel}
            showVoteButtons={votesVisible}
          />
        ))}
      </ul>
    );
  }

  if (!votesVisible) {
    return (
      <ul className="space-y-2">
        {hotels.map((hotel) => (
          <li key={hotel.name}>
            <HotelRowCompactLink hotel={hotel} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 md:space-y-3">
      {hotels.map((hotel) => (
        <HotelRow key={hotel.name} stationName={stationName} hotel={hotel} />
      ))}
    </ul>
  );
}
