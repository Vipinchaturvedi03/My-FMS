/**
 * Language Context - Hindi/English Toggle
 * FMS - Vipin Chaturvedi
 */

import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

const STORAGE_KEY = 'fms_lang';

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'hi';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentLang);
  }, [currentLang]);

  return (
    <LangContext.Provider value={{ lang: currentLang, setLang: setCurrentLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const contextValue = useContext(LangContext);
  if (!contextValue) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return contextValue;
}
