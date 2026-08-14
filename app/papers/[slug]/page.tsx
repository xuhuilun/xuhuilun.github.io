import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPapers } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx-content';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/lib/site-config';

interface PaperPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const papers = allPapers.filter((paper) => !paper.draft).map((paper) => ({ slug: paper.slug }));
  // output:export 要求动态路由至少有一个静态参数，无公开论文时返回占位参数（页面内会 404）
  return papers.length > 0 ? papers : [{ slug: '__none__' }];
}

export function generateMetadata({ params }: PaperPageProps): Metadata {
  const paper = allPapers.find((item) => item.slug === params.slug);
  if (!paper || paper.draft) {
    return {
      title: '论文未找到',
    };
  }

  const url = `${siteConfig.url}/papers/${paper.slug}`;

  return {
    title: paper.title,
    description: paper.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: paper.title,
      description: paper.description,
      url,
      type: 'article',
      publishedTime: paper.date,
      authors: [siteConfig.author],
      tags: paper.tags,
    },
  };
}

export default function PaperPage({ params }: PaperPageProps) {
  const paper = allPapers.find((item) => item.slug === params.slug);
  if (!paper || paper.draft) {
    notFound();
  }

  const url = `${siteConfig.url}/papers/${paper.slug}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ScholarlyArticle',
          headline: paper.title,
          description: paper.description,
          datePublished: paper.date,
          dateModified: paper.date,
          url,
          author: { '@type': 'Person', name: siteConfig.author },
          publisher: { '@type': 'Person', name: siteConfig.author },
          keywords: paper.tags?.join(', '),
        }}
      />
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
          <MDXContent code={paper.body.code} />
        </article>
      </main>
    </>
  );
}
