import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageToggle({ variant = 'dark' }) {
  const { lang, setLang } = useLanguage();
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-0.5 rounded-xl p-1 ${isLight ? 'bg-slate-200/80' : 'bg-slate-800/50'}`}>
      <button
        type="button"
        onClick={() => setLang('hi')}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
          lang === 'hi'
            ? isLight ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
            : isLight ? 'text-slate-600 hover:bg-slate-300/60' : 'text-slate-300 hover:bg-white/10'
        }`}
      >
        हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
          lang === 'en'
            ? isLight ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
            : isLight ? 'text-slate-600 hover:bg-slate-300/60' : 'text-slate-300 hover:bg-white/10'
        }`}
      >
        English
      </button>
    </div>
  );
}
