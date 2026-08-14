'use client';

import Link from 'next/link';

export function FloatingHome() {
  return (
    <Link
      href="/"
      aria-label="返回首页"
      title="返回首页"
      className="fixed bottom-6 right-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/60 bg-white/80 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-200/30 dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-blue-500/50 dark:hover:shadow-blue-900/20"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-slate-700 dark:text-slate-200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9.5L12 3l9 6.5" />
        <path d="M5 11v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        <path d="M10 20V14h4v6" />
      </svg>
    </Link>
  );
}
