'use client';

import {
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeElementProps {
  className?: string;
}

function getLanguage(children: ReactNode): string {
  const codeElement = Children.toArray(children).find(
    (child) => isValidElement<CodeElementProps>(child)
  );

  if (!isValidElement<CodeElementProps>(codeElement)) {
    return 'CODE';
  }

  const language = codeElement.props.className?.match(/(?:^|\s)language-([^\s]+)/)?.[1];

  return language?.toUpperCase() ?? 'CODE';
}

export function CodeBlock({ children, className, ...props }: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const language = getLanguage(children);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  async function copyCode() {
    if (!navigator.clipboard || !preRef.current) {
      return;
    }

    try {
      await navigator.clipboard.writeText(preRef.current.textContent ?? '');
      setCopied(true);

      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }

      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const copyLabel = copied ? '代码已复制' : '复制代码';

  return (
    <figure className="article-code-frame">
      <div className="article-code-toolbar" aria-hidden="true">
        <span className="article-code-language">{language}</span>
      </div>
      <button
        type="button"
        className="article-code-copy"
        data-copied={copied || undefined}
        aria-label={copyLabel}
        title={copyLabel}
        onClick={copyCode}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
      <pre ref={preRef} className={cn('article-code-pre', className)} {...props}>
        {children}
      </pre>
      <span className="sr-only" aria-live="polite">
        {copied ? '代码已复制到剪贴板' : ''}
      </span>
    </figure>
  );
}
