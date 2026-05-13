'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, AlertOctagon, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'success' | 'tip';
  children: React.ReactNode;
  title?: string;
}

const calloutStyles = {
  info: {
    container: 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    title: 'text-blue-900 dark:text-blue-200',
    text: 'text-blue-800 dark:text-blue-300',
    icon: <Info className="h-5 w-5 text-blue-500" />,
  },
  warning: {
    container: 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30',
    title: 'text-amber-900 dark:text-amber-200',
    text: 'text-amber-800 dark:text-amber-300',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  danger: {
    container: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30',
    title: 'text-red-900 dark:text-red-200',
    text: 'text-red-800 dark:text-red-300',
    icon: <AlertOctagon className="h-5 w-5 text-red-500" />,
  },
  success: {
    container: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30',
    title: 'text-green-900 dark:text-green-200',
    text: 'text-green-800 dark:text-green-300',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  tip: {
    container: 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/30',
    title: 'text-purple-900 dark:text-purple-200',
    text: 'text-purple-800 dark:text-purple-300',
    icon: <AlertCircle className="h-5 w-5 text-purple-500" />,
  },
};

export function Callout({ type = 'info', children, title }: CalloutProps) {
  const style = calloutStyles[type];

  return (
    <div className={cn('my-4 flex gap-4 rounded-lg px-4 py-4', style.container)}>
      <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className={cn('font-semibold mb-1', style.title)}>{title}</h4>
        )}
        <div className={cn('text-sm', style.text)}>
          {children}
        </div>
      </div>
    </div>
  );
}
