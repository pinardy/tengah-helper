import { useEffect } from "react";
import { destinationsForService } from "../config/destinations";

interface Props {
  serviceNo: string;
  /** Scroll to the tapped destination's card, then close. */
  onSelectDestination: (destinationId: string) => void;
  onClose: () => void;
}

/**
 * Bottom sheet listing every destination a bus service reaches. Opened by
 * tapping a service number on the Destinations screen.
 */
export function ServiceDestinationsSheet({ serviceNo, onSelectDestination, onClose }: Props) {
  const entries = destinationsForService(serviceNo);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-label={`Destinations for bus ${serviceNo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sheet-header">
          <h2>
            Bus <span className="service-no">{serviceNo}</span> goes to
          </h2>
          <button className="sheet-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <ul className="sheet-list">
          {entries.map(({ destination, option }) => (
            <li key={destination.id}>
              <button
                className="sheet-item"
                onClick={() => onSelectDestination(destination.id)}
              >
                <span className="dest-icon">{destination.icon}</span>
                <span className="sheet-item-details">
                  <span className="sheet-item-name">{destination.name}</span>
                  <span className="sheet-item-alight">
                    alight {option.alightStop}
                    {option.notes ? ` · ${option.notes}` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
