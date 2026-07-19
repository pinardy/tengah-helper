import { useState } from "react";
import { DestinationsScreen } from "./screens/DestinationsScreen";
import { GoingHomeScreen } from "./screens/GoingHomeScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { useForecast } from "./hooks/useForecast";
import { useRain } from "./hooks/useRain";
import { useTrainAlerts } from "./hooks/useTrainAlerts";

type Tab = "home" | "return" | "destinations";

// Manifest shortcuts (long-press app icon) open the app with ?tab=...
function initialTab(): Tab {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return tab === "destinations" || tab === "return" ? tab : "home";
}

export default function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const rain = useRain();
  const forecast = useForecast();
  const trainAlert = useTrainAlerts();

  // One weather pill: rain now takes priority over a rain-soon forecast.
  const weather = rain?.raining
    ? { label: "🌧️ Raining", title: `${rain.mm} mm in the last 5 min at ${rain.station}` }
    : forecast?.willRain
      ? { label: "🌦️ Rain likely", title: `${forecast.forecast} near ${forecast.area} (next 2h)` }
      : null;
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
        {weather && (
          <span className="rain-pill" title={weather.title}>
            {weather.label}
          </span>
        )}
      </header>
      {trainAlert?.disrupted && (
        <div className="alert-banner">
          ⚠️ Train disruption
          {trainAlert.lines.length > 0 && `: ${trainAlert.lines.join(", ")}`}
          {trainAlert.message && ` — ${trainAlert.message}`}
        </div>
      )}
      <main className="app-main">
        {tab === "home" && <HomeScreen onSelectService={showServiceDestinations} />}
        {tab === "return" && <GoingHomeScreen />}
        {tab === "destinations" && <DestinationsScreen focusServiceNo={focusServiceNo} />}
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
          className={tab === "return" ? "tab active" : "tab"}
          onClick={() => switchTab("return")}
        >
          <span className="tab-icon">🏠</span>
          Going Home
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
