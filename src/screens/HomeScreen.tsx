import { useMemo } from "react";
import { LastUpdated } from "../components/LastUpdated";
import { PinnedCard } from "../components/PinnedCard";
import { PullToRefresh } from "../components/PullToRefresh";
import { StopCard } from "../components/StopCard";
import { NEARBY_STOPS } from "../config/stops";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useFavourites } from "../hooks/useFavourites";
import { useNow } from "../hooks/useNow";

interface Props {
  onSelectService: (serviceNo: string) => void;
}

export function HomeScreen({ onSelectService }: Props) {
  const stopCodes = useMemo(() => NEARBY_STOPS.map((s) => s.code), []);
  const { data, lastUpdated, isFetching, error, refresh } = useBusArrivals(stopCodes);
  const { keys, toggle, isFavourite } = useFavourites();
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
      <PinnedCard
        favouriteKeys={keys}
        data={data}
        now={now}
        onToggle={toggle}
        onSelectService={onSelectService}
      />
      {NEARBY_STOPS.map((stop) => (
        <StopCard
          key={stop.code}
          stop={stop}
          arrivals={data[stop.code]}
          now={now}
          isFavourite={isFavourite}
          onToggleFavourite={toggle}
          onSelectService={onSelectService}
        />
      ))}
    </PullToRefresh>
  );
}
