import { useEffect, useMemo, useRef, useState } from "react";
import { DestinationCard } from "../components/DestinationCard";
import { LastUpdated } from "../components/LastUpdated";
import { PullToRefresh } from "../components/PullToRefresh";
import { ServiceDestinationsSheet } from "../components/ServiceDestinationsSheet";
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
  // Service whose destination list is shown in the bottom sheet.
  const [sheetServiceNo, setSheetServiceNo] = useState<string | null>(null);

  const scrollToCard = (destinationId: string) => {
    cardRefs.current[destinationId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!focusServiceNo) return;
    const target = DESTINATIONS.find((d) =>
      d.options.some((o) => o.serviceNo === focusServiceNo),
    );
    if (target) scrollToCard(target.id);
  }, [focusServiceNo]);

  const openDestination = (destinationId: string) => {
    setSheetServiceNo(null);
    scrollToCard(destinationId);
  };

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
            onSelectService={setSheetServiceNo}
          />
        </div>
      ))}
      {sheetServiceNo && (
        <ServiceDestinationsSheet
          serviceNo={sheetServiceNo}
          onSelectDestination={openDestination}
          onClose={() => setSheetServiceNo(null)}
        />
      )}
    </PullToRefresh>
  );
}
