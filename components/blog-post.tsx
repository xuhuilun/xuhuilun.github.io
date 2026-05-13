'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import type { Blog } from 'contentlayer/generated';
import { components } from '@/components/mdx-components';
import { Comments } from '@/components/comments';
import { TableOfContents } from '@/components/mdx/toc';
import { Calendar, Clock, Tag } from 'lucide-react';

interface BlogPostProps {
  post: Blog;
}

export function BlogPost({ post }: BlogPostProps) {
  const Component = useMDXComponent(post.body.code);

  // 估计阅读时间（中文：平均 150 字/分钟）
  const readingTime = Math.ceil(post.body.raw.length / 150);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Section */}
      <header className="mb-12">
        <div className="mb-6 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} 分钟阅读</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{post.tags.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {post.description && (
            <p className="mt-4 text-lg leading-8 text-gray-700 dark:text-gray-300">
              {post.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />
      </header>

      {/* Content with TOC */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <article className="lg:col-span-3">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <Component components={components} />
          </div>

          {/* Comments Section */}
          <section className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
            <Comments />
          </section>
        </article>

        {/* Sidebar with TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </main>
  );
}
