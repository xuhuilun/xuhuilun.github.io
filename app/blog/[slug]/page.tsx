import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allBlogs } from 'contentlayer/generated';
import { BlogPost } from '@/components/blog-post';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/lib/site-config';

interface BlogPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return allBlogs.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const post = allBlogs.find((item) => item.slug === params.slug);
  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: [siteConfig.author],
      tags: post.tags,
    },
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const post = allBlogs.find((item) => item.slug === params.slug);
  if (!post) {
    notFound();
  }

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          url,
          author: { '@type': 'Person', name: siteConfig.author },
          publisher: { '@type': 'Person', name: siteConfig.author },
          keywords: post.tags?.join(', '),
        }}
      />
      <BlogPost post={post} />
    </>
  );
}
