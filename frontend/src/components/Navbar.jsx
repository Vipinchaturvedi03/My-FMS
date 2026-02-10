import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import LanguageToggle from './LanguageToggle.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: t('dashboard') },
    { to: '/crops', label: t('crops') },
    { to: '/expenses', label: t('expenses') },
    { to: '/labor', label: t('labor') },
    { to: '/stock', label: t('stock') },
    { to: '/reports', label: t('reports') }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
              <span className="text-xl">🌾</span>
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">{t('appName')}</span>
          </Link>

          {/* Nav links - scroll on mobile, full on desktop */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[50vw] md:max-w-none">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="flex-shrink-0 px-3 py-2 md:px-4 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageToggle variant="light" />
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
