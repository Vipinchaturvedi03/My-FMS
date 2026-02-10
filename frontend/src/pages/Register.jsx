import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name:'', age:'', gender:'', address:'', mobile:'', password:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] ?? key;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', { method:'POST', body: JSON.stringify(form) });
      localStorage.setItem('token', res.token);
      localStorage.setItem('userName', res.user.name);
      navigate('/');
    } catch (e) {
      setErr(t('registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-slate-200/60 overflow-hidden">
        <div className="relative px-8 py-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg mb-5">
              <span className="text-4xl">📋</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{t('register')}</h1>
            <p className="text-emerald-100/90 text-sm mt-2 font-medium">
              {lang === 'hi' ? 'नया खाता बनाएं' : 'Create your account'}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-4">
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">!</span>
              <span>{err}</span>
            </div>
          )}

          <Input label={t('name')} value={form.name} onChange={v=>setForm({...form,name:v})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('age')} type="number" value={form.age} onChange={v=>setForm({...form,age:v})} />
            <Input label={t('gender')} value={form.gender} onChange={v=>setForm({...form,gender:v})} placeholder="Male/Female" />
          </div>
          <Input label={t('address')} value={form.address} onChange={v=>setForm({...form,address:v})} />
          <Input label={t('mobile')} value={form.mobile} onChange={v=>setForm({...form,mobile:v})} required />
          <Input label={t('password')} type="password" value={form.password} onChange={v=>setForm({...form,password:v})} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {lang === 'hi' ? 'रजिस्टर हो रहा है...' : 'Registering...'}
              </>
            ) : (
              t('register')
            )}
          </button>

          <div className="text-center pt-1">
            <Link to="/login" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors">
              {t('login')}
              <span>→</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type='text', ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
        value={value}
        type={type}
        onChange={e=>onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}
