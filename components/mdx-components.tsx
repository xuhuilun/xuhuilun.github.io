import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Typography = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('prose prose-slate dark:prose-invert mx-auto', className)} {...props} />
);

export const components = {
  pre: ({ className, ...props }: any) => (
    <pre className={cn('rounded-2xl border border-slate-200 bg-slate-950/90 p-4 text-sm text-slate-100 shadow-soft', className)} {...props} />
  ),
  code: ({ className, ...props }: any) => (
    <code className={cn('rounded-md bg-slate-100 px-1 py-0.5 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100', className)} {...props} />
  ),
  a: ({ className, ...props }: any) => (
    <a className={cn('text-sky-600 hover:text-sky-500 dark:text-sky-400', className)} {...props} />
  ),
  wrapper: Typography,
};
