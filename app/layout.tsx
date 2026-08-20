import 'katex/dist/katex.min.css';
import '../styles/globals.css';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { FloatingHome } from '@/components/floating-home';
import { siteConfig } from '@/lib/site-config';

const baseUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: baseUrl }],
  creator: siteConfig.author,
  icons: {
    icon: [
      { url: '/img/favicon.ico', sizes: 'any' },
      { url: '/img/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/img/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/img/favicon-64x64.png', type: 'image/png', sizes: '64x64' },
      { url: '/img/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/img/favicon-128x128.png', type: 'image/png', sizes: '128x128' },
      { url: '/img/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/img/favicon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/img/favicon-192x192.png', sizes: '192x192' }],
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: baseUrl,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'light dark',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: baseUrl,
  description: siteConfig.description,
  author: {
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.links.github,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-[#202124] dark:bg-slate-950 dark:text-slate-100">
        <link rel="preconnect" href="https://giscus.app" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <SiteHeader />
          <FloatingHome />
          <div className="flex-1">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
