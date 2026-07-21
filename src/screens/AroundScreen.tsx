import { AMENITIES } from "../config/amenities";
import { ESTATE_INFO } from "../config/estateInfo";
import { useCarparks } from "../hooks/useCarparks";
import { useDengue } from "../hooks/useDengue";

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function lotClass(available: number | null, total: number | null): string {
  if (available === null || total === null || total === 0) return "";
  const ratio = available / total;
  if (ratio < 0.1) return "load-lsd";
  if (ratio < 0.25) return "load-sda";
  return "load-sea";
}

function formatDistance(m: number): string {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

export function AroundScreen() {
  const carparks = useCarparks();
  const dengue = useDengue();
  const hasLiveParking = carparks?.some((c) => c.available !== null);

  return (
    <div className="pull-container">
      <section className="card">
        <header className="card-header">
          <h2>🦟 Dengue clusters</h2>
          <span className="card-sub">within 2 km</span>
        </header>
        {dengue === null && <p className="card-note">Loading…</p>}
        {dengue?.length === 0 && <p className="card-note">None nearby right now 🎉</p>}
        {dengue?.map((cluster) => (
          <div className="service-row" key={cluster.locality}>
            <span className="service-label">
              <span className="amenity-details">
                <span className="amenity-name">{cluster.locality}</span>
                <span className="amenity-note">{formatDistance(cluster.distanceM)} away</span>
              </span>
            </span>
            <span className="service-badges">
              <span
                className={`badge ${cluster.cases >= 10 ? "load-lsd" : "load-sda"}`}
                title={`${cluster.cases} cases`}
              >
                {cluster.cases}
              </span>
            </span>
          </div>
        ))}
      </section>

      <section className="card">
        <header className="card-header">
          <h2>🅿️ Visitor parking</h2>
          <span className="card-sub">HDB lots near home</span>
        </header>
        {carparks === null && <p className="card-note">Loading…</p>}
        {carparks?.map((cp) => (
          <div className="service-row" key={cp.number}>
            <span className="service-label">
              <span className="carpark-name">{cp.name}</span>
            </span>
            <span className="service-badges">
              {cp.available !== null ? (
                <span className={`badge ${lotClass(cp.available, cp.total)}`}>
                  {cp.available}
                </span>
              ) : (
                <span className="badge badge-empty">no data</span>
              )}
            </span>
          </div>
        ))}
        {carparks !== null && !hasLiveParking && (
          <p className="card-note">
            No live data for these carparks — set the right numbers in
            <code> src/config/carparks.ts</code>.
          </p>
        )}
      </section>

      <section className="card">
        <header className="card-header">
          <h2>🚉 Getting around Tengah</h2>
          <span className="card-sub">estate transport at a glance</span>
        </header>
        {ESTATE_INFO.map((info) => (
          <div className="info-block" key={info.title}>
            <div className="info-title">
              <span className="dest-icon">{info.icon}</span> {info.title}
            </div>
            {info.lines.map((line) => (
              <p className="card-note" key={line}>
                {line}
              </p>
            ))}
            {info.link && (
              <a
                className="info-link"
                href={info.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {info.link.label} ↗
              </a>
            )}
          </div>
        ))}
      </section>

      {AMENITIES.map((group) => (
        <section className="card" key={group.category}>
          <header className="card-header">
            <h2>
              <span className="dest-icon">{group.icon}</span> {group.category}
            </h2>
          </header>
          {group.items.map((item) => (
            <a
              className="amenity-row"
              key={item.name}
              href={mapsUrl(item.query)}
              target="_blank"
              rel="noreferrer"
            >
              <span className="amenity-details">
                <span className="amenity-name">{item.name}</span>
                {item.note && <span className="amenity-note">{item.note}</span>}
              </span>
              <span className="amenity-go" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </section>
      ))}
    </div>
  );
}
