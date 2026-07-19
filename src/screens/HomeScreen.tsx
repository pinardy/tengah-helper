import { useMemo } from "react";
import { LastUpdated } from "../components/LastUpdated";
import { PinnedCard } from "../components/PinnedCard";
import { PullToRefresh } from "../components/PullToRefresh";
import { StopCard } from "../components/StopCard";
import { NEARBY_STOPS } from "../config/stops";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useFavourites } from "../hooks/useFavourites";
import { useHomeStop } from "../hooks/useHomeStop";
import { useNow } from "../hooks/useNow";

interface Props {
  onSelectService: (serviceNo: string) => void;
}

export function HomeScreen({ onSelectService }: Props) {
  const stopCodes = useMemo(() => NEARBY_STOPS.map((s) => s.code), []);
  const { data, lastUpdated, isFetching, error, refresh } = useBusArrivals(stopCodes);
  const { keys, toggle, isFavourite } = useFavourites();
  const { homeStop, selectHomeStop } = useHomeStop();
  const now = useNow();

  // Home stop first, the rest in config order.
  const orderedStops = useMemo(
    () => [
      ...NEARBY_STOPS.filter((s) => s.code === homeStop),
      ...NEARBY_STOPS.filter((s) => s.code !== homeStop),
    ],
    [homeStop],
  );

  return (
    <PullToRefresh onRefresh={refresh}>
      <LastUpdated
        lastUpdated={lastUpdated}
        now={now}
        isFetching={isFetching}
        error={error}
        onRefresh={() => void refresh()}
      />
      <label className="home-stop-picker">
        <span>📍 Your stop</span>
        <select value={homeStop} onChange={(e) => selectHomeStop(e.target.value)}>
          {NEARBY_STOPS.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name} ({s.walkMins} min)
            </option>
          ))}
        </select>
      </label>
      <PinnedCard
        favouriteKeys={keys}
        data={data}
        now={now}
        onToggle={toggle}
        onSelectService={onSelectService}
      />
      {orderedStops.map((stop) => (
        <StopCard
          key={stop.code}
          stop={stop}
          arrivals={data[stop.code]}
          now={now}
          isHomeStop={stop.code === homeStop}
          isFavourite={isFavourite}
          onToggleFavourite={toggle}
          onSelectService={onSelectService}
        />
      ))}
    </PullToRefresh>
  );
}
