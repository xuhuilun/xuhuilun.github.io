import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Callout } from '@/components/mdx/callout';
import { Card } from '@/components/mdx/card';
import { Tabs, Tab } from '@/components/mdx/tabs';
import { Steps, Step } from '@/components/mdx/steps';
import { EnhancedImage, MDXImage } from '@/components/mdx/image';

const Typography = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('prose prose-slate dark:prose-invert mx-auto', className)} {...props} />
);

export const components = {
  // Layout
  wrapper: Typography,

  // Headings
  h1: (props: any) => (
    <h1 className="mt-8 mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-700 pb-2" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900 dark:text-gray-50" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="mt-4 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50" {...props} />
  ),

  // Text elements
  p: (props: any) => (
    <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300" {...props} />
  ),

  // Code blocks
  pre: ({ className, ...props }: any) => (
    <pre
      className={cn(
        'my-4 rounded-lg bg-slate-950 p-4 overflow-x-auto border border-slate-700',
        'shadow-lg',
        className
      )}
      {...props}
    />
  ),

  code: ({ className, children, ...props }: any) => {
    // Inline code
    if (!className) {
      return (
        <code
          className={cn(
            'rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-900',
            'dark:bg-slate-800 dark:text-slate-100',
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    // Code block (handled by pre tag)
    return (
      <code
        className={cn(
          'font-mono text-sm text-slate-100',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },

  // Links
  a: ({ className, href, ...props }: any) => (
    <a
      href={href}
      className={cn(
        'font-medium text-blue-600 dark:text-blue-400',
        'hover:text-blue-700 dark:hover:text-blue-300',
        'underline decoration-blue-200 dark:decoration-blue-800',
        'transition-colors duration-150',
        className
      )}
      {...props}
    />
  ),

  // Lists
  ul: (props: any) => (
    <ul
      className={cn(
        'my-4 list-inside space-y-2 text-gray-700 dark:text-gray-300',
        '[&_li]:marker:text-blue-500'
      )}
      {...props}
    />
  ),

  ol: (props: any) => (
    <ol
      className={cn(
        'my-4 list-inside space-y-2 text-gray-700 dark:text-gray-300',
        '[&_li]:marker:text-blue-500'
      )}
      {...props}
    />
  ),

  li: (props: any) => (
    <li className="leading-7" {...props} />
  ),

  // Blockquote
  blockquote: (props: any) => (
    <blockquote
      className={cn(
        'my-4 border-l-4 border-blue-500 pl-4 italic',
        'text-gray-700 dark:text-gray-300',
        'bg-blue-50/50 dark:bg-blue-950/20 py-2 pr-4 rounded-r'
      )}
      {...props}
    />
  ),

  // Table
  table: (props: any) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table
        className={cn(
          'w-full text-left text-sm',
          'border-collapse'
        )}
        {...props}
      />
    </div>
  ),

  thead: (props: any) => (
    <thead
      className="bg-gray-100 dark:bg-gray-900 font-semibold text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  tbody: (props: any) => (
    <tbody
      className="divide-y divide-gray-200 dark:divide-gray-700"
      {...props}
    />
  ),

  td: (props: any) => (
    <td className="px-4 py-3 text-gray-700 dark:text-gray-300" {...props} />
  ),

  th: (props: any) => (
    <th className="px-4 py-3" {...props} />
  ),

  // Images
  img: MDXImage,

  // HR
  hr: (props: any) => (
    <hr className="my-8 border-t border-gray-200 dark:border-gray-700" {...props} />
  ),

  // Custom components
  Callout,
  Card,
  Tabs,
  Tab,
  Steps,
  Step,
  Image: EnhancedImage,
};
