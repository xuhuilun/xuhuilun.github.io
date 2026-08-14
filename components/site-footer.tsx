import Link from 'next/link';
import { navigation, siteConfig } from '@/lib/site-config';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="text-lg font-semibold text-slate-950 dark:text-white">
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="页脚导航" className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:grid-cols-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="text-sm">
            <p className="font-medium text-slate-950 dark:text-white">关注</p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                GitHub
              </a>
              <a
                href="/atom.xml"
                className="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                RSS 订阅
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.author} · {siteConfig.name}
          </p>
          <p>基于 Next.js 构建，托管于 GitHub Pages</p>
        </div>
      </div>
    </footer>
  );
}
