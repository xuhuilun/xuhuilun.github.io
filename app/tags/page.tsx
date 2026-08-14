import Link from 'next/link';
import { allBlogs, allNotes, allPapers, allExperiments } from 'contentlayer/generated';

export default function TagsPage() {
  const tagCounts = new Map<string, number>();

  const documents = [...allBlogs, ...allNotes, ...allPapers, ...allExperiments].filter((doc) => !doc.draft);
  for (const doc of documents) {
    for (const tag of doc.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const tags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">标签</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">按主题浏览博客、笔记与论文。</p>

      {tags.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {tags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-soft transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              {tag}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 group-hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950">
                {count}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-20 text-center text-slate-400 dark:text-slate-500">暂无标签。</p>
      )}
    </main>
  );
}
