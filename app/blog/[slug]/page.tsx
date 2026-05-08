import { notFound } from 'next/navigation';
import { allBlogs } from 'contentlayer/generated';
import { BlogPost } from '@/components/blog-post';

interface BlogPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return allBlogs.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const post = allBlogs.find((item) => item.slug === params.slug);
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
