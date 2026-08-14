'use client';

import Link from 'next/link';

export function FloatingHome() {
  return (
    <Link
      href="/"
      aria-label="返回首页"
      title="返回首页"
      className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#4285F4] text-white shadow-[0_2px_8px_rgba(66,133,244,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_16px_rgba(66,133,244,0.5)] active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
