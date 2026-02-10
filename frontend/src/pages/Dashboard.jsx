import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';
import { CROP_CALENDAR, SEASONS } from '../data/cropCalendar';

export default function Dashboard() {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;
  const [byCat, setByCat] = useState([]);
  const [pending, setPending] = useState({ total_pending: 0 });
  const [stock, setStock] = useState([]);
  const [cropSummary, setCropSummary] = useState({ active_crops: 0, upcoming_tasks: 0 });
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [a, b, c, d] = await Promise.all([
          apiFetch('/api/expenses/summary/by-category'),
          apiFetch('/api/labor/summary/pending'),
          apiFetch('/api/stock/items'),
          apiFetch('/api/crops/summary').catch(() => ({ active_crops: 0, upcoming_tasks: 0 }))
        ]);
        setByCat(a);
        setPending(b);
        setStock(c.filter(s => s.below_threshold));
        setCropSummary(d);
      } catch (e) {
        setByCat([]);
        setPending({ total_pending: 0 });
        setStock([]);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Asia/Kolkata'
        );
        const data = await res.json();
        setWeather(data.current);
      } catch {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getCurrentSeason = () => {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return 'KHARIF';
    if (m >= 11 || m <= 2) return 'RABI';
    return 'ZAID';
  };

  const cropsThisSeason = CROP_CALENDAR.filter(c => c.season === getCurrentSeason());

  const getWeatherIcon = (code) => {
    if (!code) return '🌤️';
    if (code <= 3) return '☀️';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '🌨️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header - Modern glass card */}
      <header className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 shadow-xl shadow-emerald-900/20 border border-emerald-500/20">
        <div className="relative p-6 md:p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-emerald-100/90 text-sm font-medium mb-1">{t('hello')},</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{userName}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20">
                <span className="text-3xl">🕐</span>
                <div>
                  <p className="text-xs text-emerald-100/90 font-medium">{t('liveTime')}</p>
                  <p className="text-xl font-bold font-mono tabular-nums text-white">
                    {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                  <p className="text-xs text-emerald-100/80">{time.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20">
                <span className="text-3xl">{weather ? getWeatherIcon(weather.weather_code) : '🌤️'}</span>
                <div>
                  {weatherLoading ? (
                    <p className="text-sm text-emerald-100">{t('loading')}</p>
                  ) : weather ? (
                    <>
                      <p className="text-xs text-emerald-100/90 font-medium">{t('weather')}</p>
                      <p className="text-xl font-bold text-white">{weather.temperature_2m}°C</p>
                      <p className="text-xs text-emerald-100/80">{t('humidity')} {weather.relative_humidity_2m}%</p>
                    </>
                  ) : (
                    <p className="text-sm text-emerald-100">—</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats cards - Modern design */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
        <Card title={t('expenseByCategory')} icon="💰" gradient="from-amber-500 to-orange-600" shadow="shadow-amber-500/10">
          {byCat.map(r => (
            <div key={r.category} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
              <span className="text-slate-600 font-medium">{r.category}</span>
              <span className="font-semibold text-amber-700">₹ {Number(r.total).toFixed(2)}</span>
            </div>
          ))}
          {byCat.length === 0 && <div className="py-6 text-slate-500 text-center text-sm">{t('noExpense')}</div>}
        </Card>
        <Card title={t('pendingWages')} icon="👷" gradient="from-blue-500 to-indigo-600">
          <div className="py-6 text-center">
            <p className="text-4xl font-bold text-blue-700">₹ {Number(pending.total_pending || 0).toFixed(2)}</p>
            <p className="text-sm text-slate-500 mt-2 font-medium">{t('totalPending')}</p>
          </div>
        </Card>
        <Card title={t('lowStockAlert')} icon="⚠️" gradient="from-rose-500 to-red-600">
          {stock.map(s => (
            <div key={s.id} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
              <span className="text-slate-600 font-medium">{s.name}</span>
              <span className="font-semibold text-rose-700">{s.current_qty} {s.unit || ''}</span>
            </div>
          ))}
          {stock.length === 0 && <div className="py-6 text-slate-500 text-center text-sm">{t('noAlert')}</div>}
        </Card>
        <Link to="/crops" className="block group">
          <Card title={t('cropManagement')} icon="🌱" gradient="from-emerald-500 to-teal-600" hover>
            <div className="py-6 text-center">
              <p className="text-4xl font-bold text-emerald-700">{cropSummary.active_crops}</p>
              <p className="text-sm text-slate-600 mt-2 font-medium">{t('activeCrops')}</p>
              <p className="text-sm text-emerald-600 mt-1 font-semibold">{cropSummary.upcoming_tasks} {t('upcomingTasks')}</p>
              <p className="text-xs text-emerald-500 mt-2 font-medium group-hover:underline">{t('viewCropPlan')}</p>
            </div>
          </Card>
        </Link>
      </section>

      {/* Crops to sow - Modern card */}
      <section className="mt-8 bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          {t('cropsThisSeason')} ({SEASONS[getCurrentSeason()]?.name})
        </h2>
        <div className="flex flex-wrap gap-3">
          {cropsThisSeason.slice(0, 6).map(c => (
            <Link
              key={c.name}
              to="/crops"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all text-slate-800 font-medium"
            >
              <span className="text-xl">{c.icon}</span>
              <span className="text-sm">{c.name}</span>
            </Link>
          ))}
        </div>
        <Link to="/crops" className="inline-flex items-center gap-1 mt-4 text-emerald-600 font-semibold text-sm hover:underline">
          {t('viewFullCalendar')}
          <span>→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-10 py-6 text-center text-slate-400 text-sm border-t border-slate-200">
        <p>{t('developedBy')} <span className="font-semibold text-emerald-600">Vipin Chaturvedi</span></p>
      </footer>
    </div>
  );
}

function Card({ title, icon, gradient, hover = false, children }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200' : ''}`}>
      <div className={`bg-gradient-to-r ${gradient} text-white px-6 py-4 flex items-center gap-3`}>
        <span className="text-2xl">{icon}</span>
        <div className="font-bold text-base">{title}</div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
