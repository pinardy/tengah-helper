import { useState } from "react";
import { DestinationsScreen } from "./screens/DestinationsScreen";
import { HomeScreen } from "./screens/HomeScreen";

type Tab = "home" | "destinations";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tengah Helper</h1>
        <span className="app-sub">Parc Meadow</span>
      </header>
      <main className="app-main">
        {tab === "home" ? <HomeScreen /> : <DestinationsScreen />}
      </main>
      <nav className="tab-bar">
        <button
          className={tab === "home" ? "tab active" : "tab"}
          onClick={() => setTab("home")}
        >
          <span className="tab-icon">🚌</span>
          Nearby
        </button>
        <button
          className={tab === "destinations" ? "tab active" : "tab"}
          onClick={() => setTab("destinations")}
        >
          <span className="tab-icon">🧭</span>
          Destinations
        </button>
      </nav>
    </div>
  );
}
