import { useState } from "react";
import { DestinationsScreen } from "./screens/DestinationsScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { useRain } from "./hooks/useRain";

type Tab = "home" | "destinations";

// Manifest shortcuts (long-press app icon) open the app with ?tab=...
function initialTab(): Tab {
  return new URLSearchParams(window.location.search).get("tab") === "destinations"
    ? "destinations"
    : "home";
}

export default function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const rain = useRain();
  // Set when a bus number is tapped on the Nearby screen; the Destinations
  // screen scrolls to and highlights where that service goes.
  const [focusServiceNo, setFocusServiceNo] = useState<string | null>(null);

  const showServiceDestinations = (serviceNo: string) => {
    setFocusServiceNo(serviceNo);
    setTab("destinations");
  };

  const switchTab = (next: Tab) => {
    setFocusServiceNo(null);
    setTab(next);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tengah Helper</h1>
        <span className="app-sub">Parc Meadow</span>
        {rain?.raining && (
          <span
            className="rain-pill"
            title={`${rain.mm} mm in the last 5 min at ${rain.station}`}
          >
            🌧️ Raining
          </span>
        )}
      </header>
      <main className="app-main">
        {tab === "home" ? (
          <HomeScreen onSelectService={showServiceDestinations} />
        ) : (
          <DestinationsScreen focusServiceNo={focusServiceNo} />
        )}
      </main>
      <nav className="tab-bar">
        <button
          className={tab === "home" ? "tab active" : "tab"}
          onClick={() => switchTab("home")}
        >
          <span className="tab-icon">🚌</span>
          Nearby
        </button>
        <button
          className={tab === "destinations" ? "tab active" : "tab"}
          onClick={() => switchTab("destinations")}
        >
          <span className="tab-icon">🧭</span>
          Destinations
        </button>
      </nav>
    </div>
  );
}
