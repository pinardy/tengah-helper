import { useMemo } from "react";
import { LastUpdated } from "../components/LastUpdated";
import { PullToRefresh } from "../components/PullToRefresh";
import { StopCard } from "../components/StopCard";
import { NEARBY_STOPS } from "../config/stops";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useNow } from "../hooks/useNow";

export function HomeScreen() {
  const stopCodes = useMemo(() => NEARBY_STOPS.map((s) => s.code), []);
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
      {NEARBY_STOPS.map((stop) => (
        <StopCard key={stop.code} stop={stop} arrivals={data[stop.code]} now={now} />
      ))}
    </PullToRefresh>
  );
}
