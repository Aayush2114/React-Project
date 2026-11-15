import { useState } from "react";
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
export default function App() {
  const [city, setCity] = useState("New Delhi"),
    [weather, setWeather] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const search = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Enter a city name.");
      return;
    }
    if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
      setError(
        "Add your OpenWeatherMap API key in src/App.jsx to enable live search.",
      );
      return;
    }
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const r = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          encodeURIComponent(city) +
          "&appid=" +
          API_KEY +
          "&units=metric",
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "City not found");
      setWeather(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="app">
      <header>
        <div>
          <span className="eyebrow">WEATHER FORECAST</span>
          <h1>
            Sky<span>Cast</span>
          </h1>
          <p>Current weather conditions for cities around the world.</p>
        </div>
      </header>
      <form className="search" onSubmit={search}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city name"
        />
        <button disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {weather ? (
        <section className="panel result">
          <div>
            <small>CURRENT WEATHER</small>
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <p>{weather.weather[0].description}</p>
          </div>
          <div className="temperature">{Math.round(weather.main.temp)}°C</div>
          <div className="stats">
            <div className="stat">
              <small>FEELS LIKE</small>
              <b>{Math.round(weather.main.feels_like)}°C</b>
            </div>
            <div className="stat">
              <small>HUMIDITY</small>
              <b>{weather.main.humidity}%</b>
            </div>
            <div className="stat">
              <small>WIND</small>
              <b>{weather.wind.speed} m/s</b>
            </div>
          </div>
        </section>
      ) : (
        <section className="panel empty">
          <div style={{ fontSize: 48 }}>☀</div>
          <h2>Search for a city</h2>
          <p>Weather details will appear here after you search.</p>
        </section>
      )}
      <div className="footer">SkyCast · Powered by OpenWeatherMap</div>
    </main>
  );
}
