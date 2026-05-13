'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface TOCProps {
  className?: string;
}

export function TableOfContents({ className }: TOCProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from the document
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = Array.from(
      article.querySelectorAll('h2, h3')
    ) as HTMLElement[];

    const headingList: HeadingItem[] = headingElements
      .filter((el) => el.id) // Only include elements with IDs (set by rehype-slug)
      .map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      }));

    setHeadings(headingList);

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    headingElements.forEach((el) => {
      if (el.id) observer.observe(el);
    });

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav
      className={cn(
        'sticky top-24 space-y-2 max-h-[calc(100vh-96px)] overflow-y-auto',
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
        目录
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'block text-sm transition-colors',
                heading.level === 3 && 'pl-4',
                activeId === heading.id
                  ? 'font-semibold text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
