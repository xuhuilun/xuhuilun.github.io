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
  const posts = allBlogs.filter((post) => !post.draft).map((post) => ({ slug: post.slug }));
  // output:export 要求动态路由至少有一个静态参数，无公开文章时返回占位参数（页面内会 404）
  return posts.length > 0 ? posts : [{ slug: '__none__' }];
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const post = allBlogs.find((item) => item.slug === params.slug);
  if (!post || post.draft) {
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
  if (!post || post.draft) {
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
