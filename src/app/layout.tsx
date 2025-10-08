
"use client";

import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { I18nProvider } from '@/context/i18n-context';
import './globals.css';
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B1113" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=MedievalSharp&family=Cormorant+Garamond:wght@400;700&family=Recursive:wght@400;700&family=Covered+By+Your+Grace&family=Merienda:wght@300;400;700&family=Uncial+Antiqua&display=swap" rel="stylesheet" />
      </head>
      <body className="font-serif antialiased">
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
