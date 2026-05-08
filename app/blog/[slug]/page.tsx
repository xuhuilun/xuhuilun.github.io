import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allBlogs } from 'contentlayer/generated';
import { BlogPost } from '@/components/blog-post';

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
      description: '该博客文章不存在。',
    };
  }

  return {
    title: `${post.title} | 辉のblog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://xuhuilun.github.io/blog/${post.slug}`,
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const post = allBlogs.find((item) => item.slug === params.slug);
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
