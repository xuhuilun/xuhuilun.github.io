'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ 
  title, 
  description, 
  children, 
  className,
  hover = true,
}: CardProps) {
  return (
    <div
      className={cn(
        'my-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50',
        hover && 'transition-all duration-200 hover:shadow-md dark:hover:shadow-lg',
        className
      )}
    >
      {title && (
        <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}
