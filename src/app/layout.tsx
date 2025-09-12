
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { I18nProvider } from '@/context/i18n-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lore Weaver',
  description: 'Collaborative world-building for RPG campaigns',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:wght@400;700&family=Recursive:wght@400;700&family=Covered+By+Your+Grace&family=Merienda:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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

    