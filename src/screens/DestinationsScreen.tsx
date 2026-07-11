import { useEffect, useMemo, useRef } from "react";
import { DestinationCard } from "../components/DestinationCard";
import { LastUpdated } from "../components/LastUpdated";
import { PullToRefresh } from "../components/PullToRefresh";
import { DESTINATIONS } from "../config/destinations";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useNow } from "../hooks/useNow";

interface Props {
  /** Service tapped on the Nearby screen; scroll to and highlight its destination. */
  focusServiceNo: string | null;
}

export function DestinationsScreen({ focusServiceNo }: Props) {
  const stopCodes = useMemo(
    () => [...new Set(DESTINATIONS.flatMap((d) => d.options.map((o) => o.boardStopCode)))],
    [],
  );
  const { data, lastUpdated, isFetching, error, refresh } = useBusArrivals(stopCodes);
  const now = useNow();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!focusServiceNo) return;
    const target = DESTINATIONS.find((d) =>
      d.options.some((o) => o.serviceNo === focusServiceNo),
    );
    if (target) {
      cardRefs.current[target.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusServiceNo]);

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
        <div
          key={destination.id}
          ref={(el) => {
            cardRefs.current[destination.id] = el;
          }}
        >
          <DestinationCard
            destination={destination}
            data={data}
            now={now}
            highlightServiceNo={focusServiceNo}
          />
        </div>
      ))}
    </PullToRefresh>
  );
}
