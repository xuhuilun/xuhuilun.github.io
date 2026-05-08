'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  category: string;
  date: string;
  content: string;
};

interface SearchPanelProps {
  items: SearchItem[];
  initialQuery?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightText(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return escapeHtml(text);
  const start = Math.max(0, index - 80);
  const end = Math.min(text.length, index + query.length + 80);
  const snippet = text.slice(start, end).trim();
  const escaped = escapeHtml(snippet);
  return escaped.replace(new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'), '<mark class="rounded bg-yellow-200 px-1 dark:bg-yellow-500/30">$1</mark>');
}

export default function SearchPanel({ items, initialQuery = '' }: SearchPanelProps) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return items
      .map((item) => {
        const text = `${item.title} ${item.description} ${item.tags.join(' ')} ${item.content}`.toLowerCase();
        const score = text.split(normalizedQuery).length - 1;
        const index = text.indexOf(normalizedQuery);
        return { item, score, index };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 30)
      .map((result) => {
        const rawText = result.index >= 0 ? result.item.content : result.item.description;
        return {
          ...result,
          excerpt: result.index >= 0 ? highlightText(rawText, normalizedQuery) : result.item.description,
        };
      });
  }, [items, query]);

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索文章、笔记、论文..."
          className="flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {query.trim() !== '' ? (
        <div className="mt-6 space-y-4">
          {results.length > 0 ? (
            results.map(({ item, excerpt }) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900">
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <Link href={item.url} className="mt-3 block text-xl font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </Link>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: excerpt }} />
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              未找到匹配结果，请尝试更换关键词。
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          输入关键词即可在博客、笔记和论文中进行全文搜索。
        </div>
      )}
    </div>
  );
}
