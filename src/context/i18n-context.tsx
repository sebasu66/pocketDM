
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Import your locale files
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Locale = 'en' | 'es';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Define your translations
const translations: Record<Locale, Record<string, string>> = { en, es };

// Detect initial locale before rendering to avoid flash
const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en'; // SSR fallback

  try {
    // Check localStorage first
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale && ['en', 'es'].includes(storedLocale)) {
      return storedLocale;
    }

    // Fall back to browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') {
      return 'es';
    }
  } catch (e) {
    console.error("Could not detect initial locale", e);
  }

  return 'en';
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update function that also saves to localStorage
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (isMounted) {
      try {
        localStorage.setItem('locale', newLocale);
      } catch (e) {
        console.error("Could not save locale to localStorage", e);
      }
    }
  }, [isMounted]);

  const t = useCallback((key: string): string => {
    // Try to get the translation from the current locale
    const translated = translations[locale]?.[key];
    if (translated) {
      return translated;
    }
    // Fallback to English if the key doesn't exist in the current locale
    const fallback = translations.en[key];
    if (fallback) {
      return fallback;
    }
    // If the key is not found in English either, return the key itself
    return key;
  }, [locale]);

  const value = {
    locale,
    setLocale,
    t,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
