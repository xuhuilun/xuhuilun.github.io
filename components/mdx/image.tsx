'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface EnhancedImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function EnhancedImage({
  src,
  alt,
  caption,
  width = 800,
  height = 600,
  className,
  priority = false,
}: EnhancedImageProps) {
  return (
    <figure className="my-6">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg shadow-md dark:shadow-lg',
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full object-cover"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Fallback for direct markdown images
export function MDXImage({ src, alt, ...props }: any) {
  return (
    <div className="my-6 overflow-hidden rounded-lg shadow-md dark:shadow-lg">
      <img
        src={src}
        alt={alt}
        {...props}
        className="w-full object-cover"
      />
    </div>
  );
}
