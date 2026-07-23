import type { AirportDepartureFlight, AirportMeta } from "./airportDepartureFlight.js";
import * as airLabs from "./airLabsClient.js";
import * as aviationStack from "./aviationStackClient.js";

export type AirportFlightProviderId = "aviationstack" | "airlabs";

export type FetchDeparturesResult = {
  flights: AirportDepartureFlight[];
  provider: AirportFlightProviderId;
};

type Provider = {
  id: AirportFlightProviderId;
  hasKey: () => boolean;
  isExhaustedError: (error: unknown) => boolean;
  fetchDepartures: (originIata: string, limit?: number) => Promise<AirportDepartureFlight[]>;
  fetchAirport: (iata: string) => Promise<AirportMeta | null>;
};

const providers: Record<AirportFlightProviderId, Provider> = {
  aviationstack: {
    id: "aviationstack",
    hasKey: () => Boolean(process.env.AVIATIONSTACK_API_KEY?.trim()),
    isExhaustedError: aviationStack.isAviationStackMonthlyLimitError,
    fetchDepartures: aviationStack.fetchDeparturesFromAirport,
    fetchAirport: aviationStack.fetchAirportByIata,
  },
  airlabs: {
    id: "airlabs",
    hasKey: () => Boolean(process.env.AIRLABS_API_KEY?.trim()),
    isExhaustedError: airLabs.isAirLabsMonthlyLimitError,
    fetchDepartures: airLabs.fetchDeparturesFromAirport,
    fetchAirport: airLabs.fetchAirportByIata,
  },
};

/** Sticky preferred provider for a single collector run (AviationStack → AirLabs fallback). */
let activeProvider: AirportFlightProviderId | null = null;

export function resetAirportFlightProvider(): void {
  activeProvider = null;
}

export function availableAirportFlightProviders(): AirportFlightProviderId[] {
  return (Object.keys(providers) as AirportFlightProviderId[]).filter((id) =>
    providers[id].hasKey(),
  );
}

export function hasAirportFlightProvider(): boolean {
  return availableAirportFlightProviders().length > 0;
}

function preferredProviderOrder(): AirportFlightProviderId[] {
  const available = availableAirportFlightProviders();
  if (activeProvider && available.includes(activeProvider)) {
    return [activeProvider, ...available.filter((id) => id !== activeProvider)];
  }
  // Prefer AviationStack when both keys are present; AirLabs is the quota fallback.
  const ordered: AirportFlightProviderId[] = ["aviationstack", "airlabs"];
  return ordered.filter((id) => available.includes(id));
}

export function isAirportFlightQuotaExhaustedError(error: unknown): boolean {
  return (
    aviationStack.isAviationStackMonthlyLimitError(error) ||
    airLabs.isAirLabsMonthlyLimitError(error)
  );
}

async function withProviderFallback<T>(
  run: (provider: Provider) => Promise<T>,
): Promise<{ value: T; provider: AirportFlightProviderId }> {
  const order = preferredProviderOrder();
  if (!order.length) {
    throw new Error("No flight API key set (AVIATIONSTACK_API_KEY or AIRLABS_API_KEY)");
  }

  let lastError: unknown;
  for (let i = 0; i < order.length; i += 1) {
    const id = order[i];
    const provider = providers[id];
    try {
      const value = await run(provider);
      activeProvider = id;
      return { value, provider: id };
    } catch (error) {
      lastError = error;
      const canFallback =
        provider.isExhaustedError(error) && i < order.length - 1 && providers[order[i + 1]].hasKey();
      if (canFallback) {
        const next = order[i + 1];
        console.warn(
          `${id} quota exhausted — falling back to ${next} for the rest of this run.`,
        );
        activeProvider = next;
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export async function fetchDeparturesFromAirport(
  originIata: string,
  limit = 100,
): Promise<FetchDeparturesResult> {
  const { value, provider } = await withProviderFallback((p) =>
    p.fetchDepartures(originIata, limit),
  );
  return { flights: value, provider };
}

export async function fetchAirportByIata(iata: string): Promise<AirportMeta | null> {
  const { value } = await withProviderFallback((p) => p.fetchAirport(iata));
  return value;
}
