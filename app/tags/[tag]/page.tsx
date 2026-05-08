import Link from 'next/link';
import { allBlogs } from 'contentlayer/generated';

interface TagPageProps {
  params: { tag: string };
}

export default function TagPage({ params }: TagPageProps) {
  const posts = allBlogs
    .filter((post) => !post.draft && post.tags.includes(params.tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">标签：{params.tag}</h1>
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-slate-950 dark:text-white">
              {post.title}
            </Link>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{post.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
