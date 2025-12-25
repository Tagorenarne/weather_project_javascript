import { useState } from "react";
import axios from "axios";

export default function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchByCity = async () => {
    if (!city) return;
    fetchWeather({ city });
  };

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather({ lat: latitude, lon: longitude });
      },
      () => setError("Location permission denied")
    );
  };

  const fetchWeather = async (params) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:3000/weather", {
        params,
      });
      setData(res.data);
    } catch {
      setError("Weather not found");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff]">
      <div className="w-[380px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_#00d4ff] p-6 text-center text-white">

        <h1 className="text-2xl font-semibold mb-4 tracking-wide">
          ⚡ Weather Pulse
        </h1>

        {/* OPTIONS */}
        <button
          onClick={fetchByLocation}
          className="w-full mb-3 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition shadow-[0_0_12px_#00d4ff]"
        >
          📍 Use My Location
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchByCity()}
            className="flex-1 px-3 py-2 rounded-lg bg-white/20 outline-none placeholder:text-gray-300 focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={fetchByCity}
            className="px-4 rounded-lg bg-blue-500 hover:bg-blue-400 transition"
          >
            Go
          </button>
        </div>

        {loading && <p className="mt-4 text-cyan-200">Loading...</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}

        {data && (
          <div className="mt-5">
            <h2 className="text-xl font-medium">{data.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="icon"
              className="mx-auto drop-shadow-[0_0_12px_#00d4ff]"
            />

            <p className="text-4xl font-bold">
              {Math.round(data.main.temp)}°C
            </p>

            <p className="capitalize text-cyan-200">
              {data.weather[0].description}
            </p>

            <div className="flex justify-between text-sm mt-4 text-gray-200">
              <span>💧 {data.main.humidity}%</span>
              <span>🌬 {data.wind.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
