'use client';

import { Giscus } from '@giscus/react';

export function Comments() {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        评论区尚未配置，需在环境变量中设置 Giscus 参数。
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        theme="light"
        darkTheme="transparent_dark"
        loading="lazy"
      />
    </div>
  );
}
