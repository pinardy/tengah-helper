import { AMENITIES } from "../config/amenities";

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function AroundScreen() {
  return (
    <div className="pull-container">
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
