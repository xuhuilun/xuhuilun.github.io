import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allNotes } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { components } from '@/components/mdx-components';

interface NotePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return allNotes.map((note) => ({ slug: note.slug }));
}

export function generateMetadata({ params }: NotePageProps): Metadata {
  const note = allNotes.find((item) => item.slug === params.slug);
  if (!note) {
    return {
      title: '笔记未找到',
      description: '该笔记不存在。',
    };
  }

  return {
    title: `${note.title} | 笔记 | 辉のblog`,
    description: note.description,
    openGraph: {
      title: note.title,
      description: note.description,
      url: `https://xuhuilun.github.io/notes/${note.slug}`,
      type: 'article',
    },
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = allNotes.find((item) => item.slug === params.slug);
  if (!note) {
    notFound();
  }

  const Component = useMDXComponent(note.body.code);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="prose prose-slate mx-auto dark:prose-invert prose-headings:font-semibold prose-blockquote:border-l-slate-300 prose-code:bg-slate-100 prose-code:text-slate-950 dark:prose-code:bg-slate-800 dark:prose-code:text-slate-100">
        <h1>{note.title}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{new Date(note.date).toLocaleDateString('zh-CN')}</span>
          {note.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{note.description}</p>
        <Component components={components} />
      </article>
    </main>
  );
}
