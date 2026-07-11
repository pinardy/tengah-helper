import { useRef, useState, type ReactNode, type TouchEvent } from "react";

const TRIGGER_PX = 70;

interface Props {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
}

/** Minimal touch-based pull-to-refresh for the main scroll container. */
export function PullToRefresh({ onRefresh, children }: Props) {
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    setPull(Math.max(0, Math.min(delta, TRIGGER_PX * 1.5)));
  };

  const onTouchEnd = () => {
    if (pull >= TRIGGER_PX) void onRefresh();
    startY.current = null;
    setPull(0);
  };

  return (
    <div
      className="pull-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {pull > 0 && (
        <div className="pull-indicator" style={{ height: pull }}>
          {pull >= TRIGGER_PX ? "Release to refresh" : "Pull to refresh"}
        </div>
      )}
      {children}
    </div>
  );
}
