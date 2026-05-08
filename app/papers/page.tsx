import Link from 'next/link';
import { allPapers } from 'contentlayer/generated';

export default function PapersPage() {
  const papers = allPapers.filter((paper) => !paper.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">论文读书笔记</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">深入分析论文核心思想与复现实验结论。</p>
      <div className="mt-10 space-y-6">
        {papers.map((paper) => (
          <article key={paper.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <Link href={`/papers/${paper.slug}`} className="text-xl font-semibold text-slate-950 dark:text-white">
              {paper.title}
            </Link>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{paper.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
