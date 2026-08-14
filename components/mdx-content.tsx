'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { components } from '@/components/mdx-components';

/**
 * 客户端 MDX 渲染器。
 * useMDXComponent 是客户端 hook，且 components（含函数）不能跨服务端/客户端边界传递，
 * 因此 MDX 渲染必须整体发生在客户端组件内（与 BlogPost 同一模式）。
 */
export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
