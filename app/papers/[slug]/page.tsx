import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPapers } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { components } from '@/components/mdx-components';

interface PaperPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return allPapers.map((paper) => ({ slug: paper.slug }));
}

export function generateMetadata({ params }: PaperPageProps): Metadata {
  const paper = allPapers.find((item) => item.slug === params.slug);
  if (!paper) {
    return {
      title: '论文未找到',
      description: '该论文笔记不存在。',
    };
  }

  return {
    title: `${paper.title} | 论文 | 辉のblog`,
    description: paper.description,
    openGraph: {
      title: paper.title,
      description: paper.description,
      url: `https://xuhuilun.github.io/papers/${paper.slug}`,
      type: 'article',
    },
  };
}

export default function PaperPage({ params }: PaperPageProps) {
  const paper = allPapers.find((item) => item.slug === params.slug);
  if (!paper) {
    notFound();
  }

  const Component = useMDXComponent(paper.body.code);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="prose prose-slate mx-auto dark:prose-invert prose-headings:font-semibold prose-blockquote:border-l-slate-300 prose-code:bg-slate-100 prose-code:text-slate-950 dark:prose-code:bg-slate-800 dark:prose-code:text-slate-100">
        <h1>{paper.title}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{new Date(paper.date).toLocaleDateString('zh-CN')}</span>
          {paper.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{paper.description}</p>
        <Component components={components} />
      </article>
    </main>
  );
}
