import type { MetadataRoute } from 'next';
import { allBlogs, allNotes, allPapers, allExperiments } from 'contentlayer/generated';
import { siteConfig } from '@/lib/site-config';

const staticRoutes = [
  { path: '', priority: 1, freq: 'weekly' as const },
  { path: '/blog', priority: 0.8, freq: 'weekly' as const },
  { path: '/notes', priority: 0.8, freq: 'weekly' as const },
  { path: '/papers', priority: 0.8, freq: 'weekly' as const },
  { path: '/archives', priority: 0.6, freq: 'weekly' as const },
  { path: '/search', priority: 0.4, freq: 'monthly' as const },
  { path: '/tags', priority: 0.5, freq: 'weekly' as const },
  { path: '/about', priority: 0.5, freq: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.freq,
    priority: route.priority,
  }));

  const contentUrls: MetadataRoute.Sitemap = [
    ...allBlogs,
    ...allNotes,
    ...allPapers,
    ...allExperiments,
  ]
    .filter((doc) => !doc.draft)
    .map((doc) => ({
      url: `${siteConfig.url}${doc.url}`,
      lastModified: new Date(doc.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticUrls, ...contentUrls];
}
