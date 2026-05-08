import Link from 'next/link';
import { allBlogs } from 'contentlayer/generated';
import { siteConfig, navigation } from '@/lib/site-config';

export default function HomePage() {
  const posts = allBlogs
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">AI / CS 技术博客</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
          辉のblog：论文笔记与 AI 实践知识库
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          基于 Transformer、LoRA、RLHF、DPO、MLSys 的学习笔记与技术总结。支持 Markdown 与数学公式，适合长期构建 AI 第二大脑。
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-slate-950 dark:text-white">
              {post.title}
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{post.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag}`} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {tag}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
