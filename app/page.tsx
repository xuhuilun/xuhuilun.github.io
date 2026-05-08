'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { allBlogs, allNotes, allPapers } from 'contentlayer/generated';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const posts = allBlogs.filter((post) => !post.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  const notes = allNotes.filter((note) => !note.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const papers = allPapers.filter((paper) => !paper.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">AI / CS 技术博客</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
          辉のblog：论文笔记与 AI 实践知识库
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          基于 Transformer、LoRA、RLHF、DPO、MLSys 的学习笔记与技术总结。支持 Markdown 与数学公式，适合长期构建 AI 第二大脑。
        </p>
        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-soft dark:border-slate-700 dark:bg-slate-800">
          <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、笔记、论文..."
            className="flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
            搜索
          </button>
        </form>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">最新文章</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">论文笔记与工程实践。</p>
          <div className="mt-6 space-y-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-2xl p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                <p className="font-medium text-slate-950 dark:text-white">{post.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">最新笔记</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">快速记录 AI 学习与工具思路。</p>
          <div className="mt-6 space-y-4">
            {notes.map((note) => (
              <Link key={note.slug} href={`/notes/${note.slug}`} className="block rounded-2xl p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                <p className="font-medium text-slate-950 dark:text-white">{note.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{note.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">最新论文</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">论文读书笔记与关键结论。</p>
          <div className="mt-6 space-y-4">
            {papers.map((paper) => (
              <Link key={paper.slug} href={`/papers/${paper.slug}`} className="block rounded-2xl p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                <p className="font-medium text-slate-950 dark:text-white">{paper.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{paper.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
