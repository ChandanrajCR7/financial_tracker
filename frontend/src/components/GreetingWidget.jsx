import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';

const WEATHER_ICONS = {
  sunny: '☀️', clear: '☀️', cloudy: '☁️', overcast: '🌥️',
  rain: '🌧️', drizzle: '🌦️', storm: '⛈️', snow: '❄️',
  fog: '🌫️', mist: '🌫️', haze: '🌫️', thunder: '⛈️', blizzard: '🌨️',
  sleet: '🌨️', ice: '🧊', wind: '🌬️', hot: '🥵', cold: '🥶',
  partly: '⛅', night: '🌙',
};

function getWeatherIcon(desc = '') {
  const d = desc.toLowerCase();
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (d.includes(key)) return icon;
  }
  return '🌡️';
}

function getGreeting(name) {
  const h = new Date().getHours();
  const firstName = name.split(' ')[0];
  if (h >= 5 && h < 12) return { text: `Good Morning`, sub: `Rise and grind, ${firstName}! 💪`, emoji: '🌅' };
  if (h >= 12 && h < 17) return { text: `Good Afternoon`, sub: `Hope your day is going great, ${firstName}!`, emoji: '☀️' };
  if (h >= 17 && h < 21) return { text: `Good Evening`, sub: `Time to review your finances, ${firstName}! 📊`, emoji: '🌆' };
  return { text: `Good Night`, sub: `Don't forget to log today's expenses, ${firstName}!`, emoji: '🌙' };
}

export default function GreetingWidget() {
  const { darkMode } = useFinance();
  const name = localStorage.getItem('cashcompass_name') || 'Boss';

  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Live clock — updates every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather via wttr.in (no API key needed)
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);
        const data = await res.json();
        const current = data.current_condition[0];
        const area = data.nearest_area[0];
        const city = area.areaName[0].value;
        const country = area.country[0].value;
        setWeather({
          temp: current.temp_C,
          feels: current.FeelsLikeC,
          desc: current.weatherDesc[0].value,
          humidity: current.humidity,
          wind: current.windspeedKmph,
        });
        setLocation(`${city}, ${country}`);
      } catch {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        async () => {
          // Fallback: IP-based location
          try {
            const res = await fetch('https://wttr.in?format=j1');
            const data = await res.json();
            const current = data.current_condition[0];
            const area = data.nearest_area[0];
            setWeather({
              temp: current.temp_C,
              feels: current.FeelsLikeC,
              desc: current.weatherDesc[0].value,
              humidity: current.humidity,
              wind: current.windspeedKmph,
            });
            setLocation(`${area.areaName[0].value}, ${area.country[0].value}`);
          } catch {
            setWeather(null);
          } finally {
            setWeatherLoading(false);
          }
        }
      );
    } else {
      setWeatherLoading(false);
    }
  }, []);

  const greeting = getGreeting(name);

  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });

  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-emerald-500 p-6 sm:p-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-10 -translate-x-10 blur-xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Greeting */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{greeting.emoji}</span>
              <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                {greeting.text}, {name.split(' ')[0]}!
              </h1>
            </div>
            <p className="text-white/75 text-sm">{greeting.sub}</p>

            {/* Date */}
            <p className="text-white/90 text-sm font-medium mt-3 flex items-center gap-1.5">
              📅 {dateStr}
            </p>
          </div>

          {/* Time */}
          <div className="flex-shrink-0 text-right">
            <p className="text-white font-mono text-3xl sm:text-4xl font-extrabold tabular-nums tracking-wider drop-shadow">
              {timeStr.slice(0, -3)}
            </p>
            <p className="text-white/70 font-mono text-sm font-semibold">
              {timeStr.slice(-2)}
            </p>
          </div>
        </div>
      </div>

      {/* Weather strip */}
      <div className={`px-6 sm:px-8 py-4 flex flex-wrap items-center gap-6 border-t ${
        darkMode ? 'border-slate-700 bg-slate-800' : 'border-violet-50 bg-violet-50/30'
      }`}>
        {weatherLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fetching weather…</span>
          </div>
        ) : weather ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getWeatherIcon(weather.desc)}</span>
              <div>
                <p className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {weather.temp}°C
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{weather.desc}</p>
              </div>
            </div>

            <div className={`h-8 w-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

            <div className="flex gap-5">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Feels like</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{weather.feels}°C</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Humidity</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{weather.humidity}%</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Wind</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{weather.wind} km/h</p>
              </div>
            </div>

            {location && (
              <>
                <div className={`h-8 w-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📍</span>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{location}</p>
                </div>
              </>
            )}
          </>
        ) : (
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            🌐 Weather unavailable — allow location access to enable
          </p>
        )}
      </div>
    </div>
  );
}
