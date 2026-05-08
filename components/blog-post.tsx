'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import type { Blog } from 'contentlayer/generated';
import { components } from '@/components/mdx-components';

interface BlogPostProps {
  post: Blog;
}

export function BlogPost({ post }: BlogPostProps) {
  const Component = useMDXComponent(post.body.code);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="prose prose-slate mx-auto dark:prose-invert prose-headings:font-semibold prose-blockquote:border-l-slate-300 prose-code:bg-slate-100 prose-code:text-slate-950 dark:prose-code:bg-slate-800 dark:prose-code:text-slate-100">
        <h1>{post.title}</h1>
        <div className="space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{post.description}</p>
        <Component components={components} />
      </article>
    </main>
  );
}
