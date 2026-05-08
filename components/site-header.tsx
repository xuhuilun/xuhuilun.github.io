import Link from 'next/link';
import { Search } from 'lucide-react';
import { navigation } from '@/lib/site-config';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold text-slate-950 dark:text-white">
          辉のblog
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-4 md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                {item.title}
              </Link>
            ))}
          </nav>
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:inline-flex"
          >
            <Search size={16} />
            搜索
          </Link>
          <Link
            href="/search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          >
            <Search size={18} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
