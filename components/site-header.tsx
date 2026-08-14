'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { navigation, siteConfig } from '@/lib/site-config';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

function GoogleMark({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-[2px]', className)} aria-hidden>
      <span className="h-full w-full rounded-[30%] bg-[#4285F4]" />
      <span className="h-full w-full rounded-[30%] bg-[#EA4335]" />
      <span className="h-full w-full rounded-[30%] bg-[#FBBC05]" />
      <span className="h-full w-full rounded-[30%] bg-[#34A853]" />
    </div>
  );
}

export function SiteHeader() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8eaed] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <GoogleMark className="h-6 w-6" />
          <span className="text-[17px] font-medium tracking-tight text-[#202124]">{siteConfig.name}</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-sm text-[#5f6368] transition hover:bg-[#f1f3f4] hover:text-[#202124]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-full border border-[#dfe1e5] bg-[#f8f9fa] px-4 py-2 transition focus-within:border-[#4285F4] focus-within:bg-white md:flex">
            <Search size={16} className="text-[#9aa0a6]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索..."
              className="w-32 bg-transparent text-sm text-[#202124] outline-none placeholder:text-[#9aa0a6] dark:text-slate-200"
            />
          </form>

          <button
            type="button"
            onClick={() => router.push('/search')}
            aria-label="搜索"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#f1f3f4] md:hidden"
          >
            <Search size={18} />
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#f1f3f4] md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="移动端导航"
          className="border-t border-[#e8eaed] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(32,33,36,0.08)] md:hidden"
        >
          <div className="grid grid-cols-2 gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-3 py-2.5 text-sm text-[#5f6368] transition hover:bg-[#f1f3f4] hover:text-[#202124]"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
