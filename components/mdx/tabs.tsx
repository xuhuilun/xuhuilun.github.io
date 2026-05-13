'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  defaultIndex?: number;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({ children, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'px-4 py-3 font-medium transition-colors',
              activeIndex === index
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[activeIndex].props.children}
      </div>
    </div>
  );
}
