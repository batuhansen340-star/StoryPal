import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t as translate } from './i18n';

type TranslationKey = Parameters<typeof translate>[0];

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translate(key, 'en'),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem('storypal_language').then((lang) => {
      if (lang) setLanguageState(lang);
    });
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    AsyncStorage.setItem('storypal_language', code);
  }, []);

  const t = useCallback((key: TranslationKey) => translate(key, language), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
