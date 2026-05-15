import Link from 'next/link';
import { allBlogs, allPapers, allNotes, allExperiments } from 'contentlayer/generated';

type Entry = {
  title: string;
  url: string;
  date: string;
  tags: string[];
  type: string;
};

export default function ArchivesPage() {
  const allEntries: Entry[] = [
    ...allBlogs.map((p) => ({ title: p.title, url: p.url, date: p.date, tags: p.tags ?? [], type: 'blog' })),
    ...allPapers.map((p) => ({ title: p.title, url: p.url, date: p.date, tags: p.tags ?? [], type: 'paper' })),
    ...allNotes.map((p) => ({ title: p.title, url: p.url, date: p.date, tags: p.tags ?? [], type: 'note' })),
    ...allExperiments.map((p) => ({ title: p.title, url: p.url, date: p.date, tags: p.tags ?? [], type: 'experiment' })),
  ]
    .filter((e) => e.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const typeLabel: Record<string, string> = {
    blog: '博客',
    paper: '论文',
    note: '笔记',
    experiment: '实验',
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">归档</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        目前共有 {allEntries.length} 篇公开文章。
      </p>

      <div className="relative mt-12 pl-20 sm:pl-28">
        {/* timeline axis */}
        <div className="absolute left-[54px] sm:left-[66px] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-10">
          {allEntries.map((entry) => {
            const d = new Date(entry.date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;

            return (
              <div key={entry.url} className="relative">
                {/* timeline dot + date */}
                <div className="absolute left-[-80px] sm:left-[-112px] top-0 w-[80px] sm:w-[112px] text-right pr-5 sm:pr-7">
                  <time dateTime={entry.date} className="block leading-tight">
                    <span className="block text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                      {day}
                    </span>
                    <span className="block text-[0.7rem] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
                      {month}
                    </span>
                  </time>
                </div>
                {/* dot */}
                <span className="absolute left-[51px] sm:left-[63px] top-[5px] h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400 ring-2 ring-white dark:ring-slate-950 ring-offset-2 ring-offset-blue-600 dark:ring-offset-blue-400" />

                {/* card */}
                <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {typeLabel[entry.type] ?? entry.type}
                    </span>
                  </div>
                  <Link href={entry.url} className="text-base sm:text-lg font-semibold text-slate-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors leading-snug">
                    {entry.title}
                  </Link>
                  {entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[0.7rem] text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {allEntries.length === 0 && (
        <p className="mt-20 text-center text-slate-400 dark:text-slate-500">暂无文章。</p>
      )}
    </main>
  );
}
