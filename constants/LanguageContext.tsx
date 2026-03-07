import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { t as translate } from './i18n';

type TranslationKey = Parameters<typeof translate>[0];

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  storyLanguage: string;
  setStoryLanguage: (code: string) => void;
  t: (key: TranslationKey) => string;
}

const SUPPORTED = ['en', 'tr', 'es', 'ar', 'ja', 'fr', 'de', 'pt', 'ko', 'hi'];

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  storyLanguage: 'en',
  setStoryLanguage: () => {},
  t: (key) => translate(key, 'en'),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [storyLanguage, setStoryLanguageState] = useState('en');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('storypal_app_language'),
      AsyncStorage.getItem('storypal_story_language'),
      AsyncStorage.getItem('storypal_language'),
    ]).then(([appLang, storyLang, legacyLang]) => {
      const deviceLang = getLocales()[0]?.languageCode ?? 'en';
      const fallback = SUPPORTED.includes(deviceLang) ? deviceLang : 'en';

      const resolvedApp = appLang ?? legacyLang ?? fallback;
      const resolvedStory = storyLang ?? legacyLang ?? fallback;

      setLanguageState(resolvedApp);
      setStoryLanguageState(resolvedStory);

      if (!appLang) AsyncStorage.setItem('storypal_app_language', resolvedApp);
      if (!storyLang) AsyncStorage.setItem('storypal_story_language', resolvedStory);
    });
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    AsyncStorage.setItem('storypal_app_language', code);
  }, []);

  const setStoryLanguage = useCallback((code: string) => {
    setStoryLanguageState(code);
    AsyncStorage.setItem('storypal_story_language', code);
  }, []);

  const t = useCallback((key: TranslationKey) => translate(key, language), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, storyLanguage, setStoryLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
