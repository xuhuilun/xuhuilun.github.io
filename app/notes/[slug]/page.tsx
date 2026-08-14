import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allNotes } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx-content';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/lib/site-config';

interface NotePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const notes = allNotes.filter((note) => !note.draft).map((note) => ({ slug: note.slug }));
  // output:export 要求动态路由至少有一个静态参数，无公开笔记时返回占位参数（页面内会 404）
  return notes.length > 0 ? notes : [{ slug: '__none__' }];
}

export function generateMetadata({ params }: NotePageProps): Metadata {
  const note = allNotes.find((item) => item.slug === params.slug);
  if (!note || note.draft) {
    return {
      title: '笔记未找到',
    };
  }

  const url = `${siteConfig.url}/notes/${note.slug}`;

  return {
    title: note.title,
    description: note.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: note.title,
      description: note.description,
      url,
      type: 'article',
      publishedTime: note.date,
      authors: [siteConfig.author],
      tags: note.tags,
    },
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = allNotes.find((item) => item.slug === params.slug);
  if (!note || note.draft) {
    notFound();
  }

  const url = `${siteConfig.url}/notes/${note.slug}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: note.title,
          description: note.description,
          datePublished: note.date,
          dateModified: note.date,
          url,
          author: { '@type': 'Person', name: siteConfig.author },
          publisher: { '@type': 'Person', name: siteConfig.author },
          keywords: note.tags?.join(', '),
        }}
      />
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
          <MDXContent code={note.body.code} />
        </article>
      </main>
    </>
  );
}
