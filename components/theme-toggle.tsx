'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const resolvedTheme = theme === 'system' ? 'light' : theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dadce0] bg-white text-[#5f6368] shadow-[0_1px_3px_rgba(60,64,67,0.12)] transition hover:bg-[#f8f9fa] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      aria-label="切换主题"
    >
      {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
