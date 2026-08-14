'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { allBlogs, allPapers } from 'contentlayer/generated';
import { cn } from '@/lib/utils';

/** Google Brand Colors */
const G = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
} as const;

/** 蓝红黄绿四色圆角方形标志（Google 风格 squircle mark） */
function GoogleMark({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-1', className)} aria-hidden>
      <span className="h-full w-full rounded-[28%] bg-[#4285F4]" />
      <span className="h-full w-full rounded-[28%] bg-[#EA4335]" />
      <span className="h-full w-full rounded-[28%] bg-[#FBBC05]" />
      <span className="h-full w-full rounded-[28%] bg-[#34A853]" />
    </div>
  );
}

type ContentItem = {
  title: string;
  description: string;
  tags: string[];
  url: string;
  date: string;
};

const hotSearches = ['Transformer', 'KV Cache', 'CLIP'];

function ContentCard({ item, color }: { item: ContentItem; color: string }) {
  return (
    <Link
      href={item.url}
      className="group block rounded-3xl border border-[#e8eaed] bg-white p-6 shadow-[0_1px_6px_rgba(32,33,36,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#dadce0] hover:shadow-[0_4px_16px_rgba(32,33,36,0.12)]"
    >
      <div className="flex items-center gap-2 text-xs text-[#5f6368]">
        <span className={cn('h-2 w-2 rounded-full', color)} />
        <span>{new Date(item.date).toLocaleDateString('zh-CN')}</span>
      </div>
      <h3 className="mt-3 text-base font-medium leading-snug text-[#202124] transition-colors group-hover:text-[#1a73e8]">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5f6368]">{item.description}</p>
      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[#f1f3f4] px-2.5 py-0.5 text-xs text-[#5f6368]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

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

  const posts: ContentItem[] = allBlogs
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((post) => ({
      title: post.title,
      description: post.description,
      tags: post.tags,
      url: post.url,
      date: post.date,
    }));

  const papers: ContentItem[] = allPapers
    .filter((paper) => !paper.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((paper) => ({
      title: paper.title,
      description: paper.description,
      tags: paper.tags,
      url: paper.url,
      date: paper.date,
    }));

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      {/* ===== Hero：四色标志 + 大搜索框 ===== */}
      <section className="flex flex-col items-center text-center">
        <GoogleMark className="h-12 w-12 gap-1.5" />

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#202124] sm:text-5xl">
          <span className="text-[#4285F4]">LLM</span>论文精读
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#5f6368]">
          面向 AI / CS 技术学习者的论文笔记与知识库，用大白话讲清大模型与论文原理。
        </p>

        <form onSubmit={handleSearch} className="mt-10 w-full max-w-2xl">
          <div className="flex items-center gap-3 rounded-full border border-[#dfe1e5] bg-white py-3 pl-5 pr-2 shadow-[0_1px_6px_rgba(32,33,36,0.08)] transition-all duration-200 focus-within:border-[#4285F4] focus-within:shadow-[0_1px_6px_rgba(66,133,244,0.28)]">
            <Search className="h-5 w-5 flex-shrink-0 text-[#9aa0a6]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章、论文..."
              className="flex-1 bg-transparent text-[15px] text-[#202124] outline-none placeholder:text-[#9aa0a6]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#4285F4] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3367d6] active:scale-95"
            >
              搜索
            </button>
          </div>
        </form>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm text-[#5f6368]">
          <span>热门搜索：</span>
          {hotSearches.map((term, i) => (
            <button
              key={term}
              type="button"
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className={cn(
                'rounded-full border px-3.5 py-1 transition hover:bg-[#f8f9fa]',
                i === 0 && 'border-[#4285F4]/30 text-[#4285F4]',
                i === 1 && 'border-[#EA4335]/30 text-[#EA4335]',
                i === 2 && 'border-[#34A853]/30 text-[#34A853]'
              )}
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* ===== 最新文章 ===== */}
      <section className="mt-24">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#4285F4]" />
          <h2 className="text-lg font-medium text-[#202124]">最新文章</h2>
        </div>
        {posts.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <ContentCard key={post.url} item={post} color="bg-[#4285F4]" />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-[#9aa0a6]">暂无文章。</p>
        )}
      </section>

      {/* ===== 最新论文 ===== */}
      <section className="mt-16">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#34A853]" />
          <h2 className="text-lg font-medium text-[#202124]">最新论文</h2>
        </div>
        {papers.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {papers.map((paper) => (
              <ContentCard key={paper.url} item={paper} color="bg-[#34A853]" />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-[#9aa0a6]">暂无论文。</p>
        )}
      </section>
    </main>
  );
}
