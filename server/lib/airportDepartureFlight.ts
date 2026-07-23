/** Normalized departure used by airport connection baking (any upstream provider). */
export type AirportDepartureFlight = {
  flight_date?: string;
  flight_status?: string;
  departure?: {
    iata?: string | null;
    airport?: string | null;
  };
  arrival?: {
    iata?: string | null;
    airport?: string | null;
  };
  airline?: {
    name?: string | null;
    iata?: string | null;
  };
  flight?: {
    number?: string | null;
    iata?: string | null;
  };
};

export type AirportMeta = {
  iata_code?: string | null;
  airport_name?: string | null;
  country_name?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
};
