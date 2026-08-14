import Link from 'next/link';
import { allBlogs, allNotes, allPapers, allExperiments } from 'contentlayer/generated';

interface TagPageProps {
  params: { tag: string };
}

type Entry = {
  title: string;
  url: string;
  date: string;
  type: string;
};

const typeLabel: Record<string, string> = {
  blog: '博客',
  note: '笔记',
  paper: '论文',
  experiment: '实验',
};

export function generateStaticParams() {
  const tags = new Set<string>();
  for (const doc of [...allBlogs, ...allNotes, ...allPapers, ...allExperiments]) {
    for (const tag of doc.tags ?? []) {
      tags.add(tag);
    }
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export function generateMetadata({ params }: TagPageProps) {
  return {
    title: `标签：${params.tag}`,
    description: `浏览标签「${params.tag}」下的博客、笔记与论文。`,
  };
}

export default function TagPage({ params }: TagPageProps) {
  const entries: Entry[] = [
    ...allBlogs.filter((post) => !post.draft && post.tags.includes(params.tag)).map((post) => ({ title: post.title, url: post.url, date: post.date, type: 'blog' })),
    ...allNotes.filter((note) => !note.draft && note.tags.includes(params.tag)).map((note) => ({ title: note.title, url: note.url, date: note.date, type: 'note' })),
    ...allPapers.filter((paper) => !paper.draft && paper.tags.includes(params.tag)).map((paper) => ({ title: paper.title, url: paper.url, date: paper.date, type: 'paper' })),
    ...allExperiments.filter((experiment) => !experiment.draft && experiment.tags.includes(params.tag)).map((experiment) => ({ title: experiment.title, url: experiment.url, date: experiment.date, type: 'experiment' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">标签：{params.tag}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">共 {entries.length} 篇相关内容。</p>
      <div className="mt-8 space-y-6">
        {entries.map((entry) => (
          <article key={entry.url} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {typeLabel[entry.type] ?? entry.type}
              </span>
              <span>{new Date(entry.date).toLocaleDateString('zh-CN')}</span>
            </div>
            <Link href={entry.url} className="mt-3 block text-xl font-semibold text-slate-950 dark:text-white">
              {entry.title}
            </Link>
          </article>
        ))}
      </div>

      {entries.length === 0 && (
        <p className="mt-20 text-center text-slate-400 dark:text-slate-500">该标签下暂无内容。</p>
      )}
    </main>
  );
}
