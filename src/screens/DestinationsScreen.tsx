import { useMemo } from "react";
import { DestinationCard } from "../components/DestinationCard";
import { LastUpdated } from "../components/LastUpdated";
import { PullToRefresh } from "../components/PullToRefresh";
import { DESTINATIONS } from "../config/destinations";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useNow } from "../hooks/useNow";

export function DestinationsScreen() {
  const stopCodes = useMemo(
    () => [...new Set(DESTINATIONS.flatMap((d) => d.options.map((o) => o.boardStopCode)))],
    [],
  );
  const { data, lastUpdated, isFetching, error, refresh } = useBusArrivals(stopCodes);
  const now = useNow();

  return (
    <PullToRefresh onRefresh={refresh}>
      <LastUpdated
        lastUpdated={lastUpdated}
        now={now}
        isFetching={isFetching}
        error={error}
        onRefresh={() => void refresh()}
      />
      {DESTINATIONS.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} data={data} now={now} />
      ))}
    </PullToRefresh>
  );
}
