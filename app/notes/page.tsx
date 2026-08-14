import Link from 'next/link';
import { allNotes } from 'contentlayer/generated';

export default function NotesPage() {
  const notes = allNotes.filter((note) => !note.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">学习笔记</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">快速笔记、工具思路与知识卡片。</p>
      <div className="mt-10 space-y-6">
        {notes.map((note) => (
          <article key={note.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950">
            <Link href={`/notes/${note.slug}`} className="text-xl font-semibold text-slate-950 dark:text-white">
              {note.title}
            </Link>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{note.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{new Date(note.date).toLocaleDateString('zh-CN')}</span>
              {note.tags.map((tag) => (
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
