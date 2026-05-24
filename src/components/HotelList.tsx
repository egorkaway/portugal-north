import { Euro, ExternalLink, Navigation } from "lucide-react";
import type { Hotel } from "@/data/hotels";
import { useHotelVote } from "@/hooks/useHotelVote";
import { VoteButtons } from "@/components/VoteButtons";

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
}: {
  stationName: string;
  hotels: Hotel[];
}) {
  if (hotels.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No recommended hotels listed for this station yet.
      </p>
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
