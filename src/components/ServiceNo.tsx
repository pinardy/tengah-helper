import { destinationIdsForService } from "../config/destinations";

interface Props {
  serviceNo: string;
  onSelectService?: (serviceNo: string) => void;
}

/**
 * A bus service number. When the service leads to a known destination and a
 * handler is given, it renders as a link that jumps to the Destinations tab.
 */
export function ServiceNo({ serviceNo, onSelectService }: Props) {
  if (onSelectService && destinationIdsForService(serviceNo).length > 0) {
    return (
      <button
        className="service-no service-no-link"
        onClick={() => onSelectService(serviceNo)}
        aria-label={`Show destinations for bus ${serviceNo}`}
      >
        {serviceNo}
      </button>
    );
  }
  return <span className="service-no">{serviceNo}</span>;
}
