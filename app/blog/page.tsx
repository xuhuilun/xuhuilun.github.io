import Link from 'next/link';
import { allBlogs } from 'contentlayer/generated';

export default function BlogPage() {
  const posts = allBlogs.filter((post) => !post.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">博客文章</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">按时间排序，包含论文笔记、技术实践与模型优化主题。</p>
      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950">
            <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-slate-950 dark:text-white">
              {post.title}
            </Link>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag}`} className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  {tag}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
