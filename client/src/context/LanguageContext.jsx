import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../i18n/en.json';
import taTranslations from '../i18n/ta.json';

const LanguageContext = createContext(null);

const DICTIONARIES = {
  en: enTranslations,
  ta: taTranslations
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('emergency_app_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('emergency_app_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, fallback = '') => {
    const currentDict = DICTIONARIES[lang] || DICTIONARIES.en;
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // Fallback to English
    if (DICTIONARIES.en[key]) {
      return DICTIONARIES.en[key];
    }
    return fallback || key;
  };

  const toggleLanguage = (selectedLang) => {
    if (selectedLang) {
      setLang(selectedLang);
    } else {
      setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
