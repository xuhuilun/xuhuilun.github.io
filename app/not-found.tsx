import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">404</p>
      <h1 className="mt-6 text-4xl font-semibold text-slate-950 dark:text-white">页面未找到</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">该页面不存在，或已被移动。</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
        返回首页
      </Link>
    </main>
  );
}
