import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../utils/translations';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key: string) => key,
  isAnimating: false,
  setIsAnimating: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('site_language');
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
  };

  const t = (key: string) => {
    const dict = translations[language] || translations['tr'];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating, setIsAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};
