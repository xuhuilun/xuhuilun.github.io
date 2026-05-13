'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StepProps {
  title?: string;
  children: React.ReactNode;
}

interface StepsProps {
  children: React.ReactElement<StepProps>[];
}

export function Step({ children }: StepProps) {
  return <>{children}</>;
}

export function Steps({ children }: StepsProps) {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[];

  return (
    <div className="my-6 space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          {/* Step number circle */}
          <div className="flex flex-shrink-0 flex-col items-center">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white',
                index < steps.length - 1 && 'mb-4'
              )}
              style={{
                background: 'linear-gradient(135deg, rgb(59 130 246) 0%, rgb(99 102 241) 100%)',
              }}
            >
              {index + 1}
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-400" />
            )}
          </div>

          {/* Step content */}
          <div className="flex-1 pb-4">
            {step.props.title && (
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                {step.props.title}
              </h4>
            )}
            <div className="text-gray-700 dark:text-gray-300">
              {step.props.children}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
