import { Euro, ExternalLink, Navigation } from "lucide-react";
import type { Hotel } from "@/data/hotels";
import { useHotelVote } from "@/hooks/useHotelVote";
import { VoteButtons } from "@/components/VoteButtons";

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
          {hotel.distanceKm} km from station
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-primary">
        <Euro className="h-3 w-3" aria-hidden="true" />
        {hotel.priceFrom}
        <span className="sr-only"> euros per night from</span>
      </span>
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
            {hotel.distanceKm} km from station
          </p>
        </a>
        <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm font-semibold text-primary">
          <Euro className="h-3 w-3" aria-hidden="true" />
          {hotel.priceFrom}
          <span className="sr-only"> euros per night from</span>
        </span>
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
  const { vote, cast } = useHotelVote(stationName, hotel.name);

  return (
    <li className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium text-foreground">{hotel.name}</p>
          <span className="text-sm font-semibold text-primary whitespace-nowrap flex items-center gap-0.5 shrink-0">
            <Euro className="w-3 h-3" aria-hidden="true" />
            {hotel.priceFrom}
            <span className="sr-only"> euros per night from</span>
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
          <Navigation className="w-3 h-3 shrink-0" aria-hidden="true" />
          {hotel.distanceKm} km from station
        </p>
        <a
          href={hotel.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View on Booking
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
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
  const votesVisible = showVoteButtons ?? variant === "full";
  if (hotels.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No recommended hotels listed for this station yet.
      </p>
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
    <ul className="space-y-3">
      {hotels.map((hotel) => (
        <HotelRow key={hotel.name} stationName={stationName} hotel={hotel} />
      ))}
    </ul>
  );
}
