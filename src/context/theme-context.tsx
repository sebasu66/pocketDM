
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type HandwritingFont = 'grace' | 'merienda' | 'comic';

interface ThemeContextType {
  handwritingFont: HandwritingFont;
  setHandwritingFont: (font: HandwritingFont) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [handwritingFont, setHandwritingFont] = useState<HandwritingFont>('grace');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFont = localStorage.getItem('handwritingFont') as HandwritingFont | null;
      if (storedFont && ['grace', 'merienda', 'comic'].includes(storedFont)) {
        setHandwritingFont(storedFont);
      }
    } catch (e) {
      console.error("Could not access local storage", e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    document.body.classList.remove('font-handwriting-grace', 'font-handwriting-merienda', 'font-handwriting-comic');
    document.body.classList.add(`font-handwriting-${handwritingFont}`);
    try {
      localStorage.setItem('handwritingFont', handwritingFont);
    } catch (e) {
      console.error("Could not access local storage", e);
    }
  }, [handwritingFont, isMounted]);

  const value = {
    handwritingFont,
    setHandwritingFont,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
