import '../styles/globals.css';
import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { FloatingHome } from '@/components/floating-home';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <FloatingHome />
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
