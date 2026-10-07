import { useState, useEffect } from 'react';
import { fetchLiveWeather, geocodeWeatherCity } from '../../services/weatherService';
import { useLanguage } from '../../context/LanguageContext';

export default function WeatherOverviewCard({ defaultCity = 'Greater Noida, UP' }) {
  const { lang } = useLanguage();
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCityName, setActiveCityName] = useState(defaultCity);

  const loadWeather = async (lat, lng, cityName) => {
    setLoading(true);
    try {
      const data = await fetchLiveWeather(lat, lng, cityName);
      setWeatherData(data);
      setActiveCityName(cityName);
    } catch (err) {
      console.error('Weather load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(28.4744, 77.5040, defaultCity);
  }, [defaultCity]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = cityInput.trim();
    if (!query) return;
    const geo = await geocodeWeatherCity(query);
    if (geo) {
      await loadWeather(geo.lat, geo.lng, geo.name);
      setCityInput('');
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadWeather(latitude, longitude, 'Your GPS Location');
      },
      (err) => console.warn('Weather GPS error:', err)
    );
  };

  const current = weatherData?.current;
  const hourly = weatherData?.hourly || [];
  const daily = weatherData?.daily || [];

  return (
    <div className="rounded-2xl border border-sky-600/30 bg-gradient-to-b from-sky-900/90 via-sky-950/90 to-slate-900/95 p-4 sm:p-5 text-white shadow-xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
        <h3 className="text-base font-extrabold flex items-center gap-2 text-sky-100">
          <span>Weather Overview</span>
        </h3>
        <span className="text-xs font-bold text-sky-300">
          📍 {activeCityName}
        </span>
      </div>

      {/* Location Search Bar matching image 2 */}
      <form onSubmit={handleSearch} className="relative flex items-center gap-1.5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            📍
          </span>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder={lang === 'hi' ? 'शहर का नाम खोजें...' : 'Search city (e.g. Greater Noida, Delhi, Prayagraj)...'}
            className="w-full rounded-xl border border-sky-700/60 bg-sky-950/70 py-2 pl-8 pr-8 text-xs text-white placeholder-sky-400/60 focus:border-sky-400 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-sky-300 hover:text-white"
            title="Search"
          >
            🔍
          </button>
        </div>

        <button
          type="button"
          onClick={handleDetectGps}
          title="Detect GPS"
          className="rounded-xl bg-sky-700/60 hover:bg-sky-600 px-2.5 py-2 text-xs font-bold transition-colors"
        >
          🎯
        </button>
      </form>

      {loading ? (
        <div className="py-6 text-center text-xs text-sky-300">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mr-2 align-middle" />
          <span>Fetching live meteorological telemetry...</span>
        </div>
      ) : (
        <>
          {/* Current Weather Banner matching Image 2 */}
          <div className="flex items-center justify-between rounded-xl bg-sky-800/40 border border-sky-600/30 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{current?.icon || '⛅'}</span>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black">{current?.temp ?? 32}°C</span>
                  <span className="text-sm font-semibold capitalize text-sky-200">
                    {lang === 'hi' ? current?.conditionHi : current?.condition}
                  </span>
                </div>
                <p className="text-[10px] text-sky-300/80">
                  Humidity: {current?.humidity}% · Wind: {current?.windSpeed} km/h
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              Live IMD/Open-Meteo
            </span>
          </div>

          {/* Hourly Forecast matching Image 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-200">
              Hourly Forecast
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-sky-700">
              {hourly.map((h, i) => (
                <div
                  key={i}
                  className="min-w-[85px] sm:min-w-[95px] rounded-xl border border-sky-700/50 bg-sky-800/40 p-2.5 text-center space-y-1 hover:bg-sky-700/50 transition-colors"
                >
                  <span className="block text-[11px] font-bold text-sky-200">{h.time}</span>
                  <span className="block text-xl">{h.icon}</span>
                  <span className="block text-xs font-black">{h.temp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Forecast */}
          <div className="space-y-2 pt-1 border-t border-sky-500/20">
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-200">
              Daily Forecast
            </h4>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {daily.map((d, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-sky-700/40 bg-sky-950/60 p-2 space-y-1"
                >
                  <span className="block text-[10px] font-bold text-sky-300">{d.day}</span>
                  <span className="block text-base">{d.icon}</span>
                  <span className="block text-[11px] font-black">{d.maxTemp}</span>
                  <span className="block text-[9px] text-sky-400/80">{d.minTemp}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
