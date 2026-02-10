/**
 * Login Page - User Authentication
 * FMS - Vipin Chaturvedi
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { translations } from '../translations.js';
import { apiFetch } from '../api';

export default function Login() {
  const [mobileInput, setMobileInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigateTo = useNavigate();
  const { lang } = useLanguage();
  const getTranslation = (key) => translations[lang]?.[key] ?? key;

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const loginResponse = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ mobile: mobileInput, password: passwordInput })
      });
      localStorage.setItem('token', loginResponse.token);
      localStorage.setItem('userName', loginResponse.user.name);
      navigateTo('/');
    } catch (error) {
      setErrorMessage(getTranslation('loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-slate-200/60 overflow-hidden">
        {/* Header - Modern gradient */}
        <div className="relative px-8 py-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg mb-5">
              <span className="text-4xl">🌾</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{getTranslation('login')}</h1>
            <p className="text-emerald-100/90 text-sm mt-2 font-medium">
              {lang === 'hi' ? 'किसान कृषि में आपका स्वागत है' : 'Welcome to Kisan Krishi'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="p-8 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{getTranslation('mobile')}</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-emerald-500">📱</span>
              <input
                type="tel"
                className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                placeholder={lang === 'hi' ? 'मोबाइल नंबर दर्ज करें' : 'Enter mobile number'}
                value={mobileInput}
                onChange={e => setMobileInput(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{getTranslation('password')}</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-emerald-500">🔒</span>
              <input
                type="password"
                className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                placeholder={lang === 'hi' ? 'पासवर्ड दर्ज करें' : 'Enter password'}
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {lang === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...'}
              </>
            ) : (
              <>
                {getTranslation('login')}
                <span className="text-lg">→</span>
              </>
            )}
          </button>

          <div className="text-center pt-1">
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
            >
              {getTranslation('createAccount')}
              <span>→</span>
            </Link>
          </div>
        </form>
      </div>

      <p className="text-center text-slate-400 text-xs mt-8 font-medium">
        {lang === 'hi' ? 'कृषि प्रबंधन को सरल बनाना' : 'Simplifying farm management'}
      </p>
    </div>
  );
}
