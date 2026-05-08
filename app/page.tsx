import Link from 'next/link';
import { allBlogs, allNotes, allPapers } from 'contentlayer/generated';

export default function HomePage() {
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
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/search" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            立即全文搜索
          </Link>
          <Link href="/blog" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            查看最新文章
          </Link>
        </div>
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
