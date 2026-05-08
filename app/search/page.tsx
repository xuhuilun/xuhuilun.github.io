import SearchPanel from '@/components/search-panel';
import { allBlogs, allNotes, allPapers, allExperiments } from 'contentlayer/generated';

function buildSearchItems() {
  const allDocuments = [
    ...allBlogs.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.description,
      tags: post.tags,
      url: post.url,
      category: '博客',
      date: new Date(post.date).toLocaleDateString('zh-CN'),
      content: (post.body as any)?.raw ?? '',
    })),
    ...allNotes.map((note) => ({
      id: `note-${note.slug}`,
      title: note.title,
      description: note.description,
      tags: note.tags,
      url: note.url,
      category: '笔记',
      date: new Date(note.date).toLocaleDateString('zh-CN'),
      content: (note.body as any)?.raw ?? '',
    })),
    ...allPapers.map((paper) => ({
      id: `paper-${paper.slug}`,
      title: paper.title,
      description: paper.description,
      tags: paper.tags,
      url: paper.url,
      category: '论文',
      date: new Date(paper.date).toLocaleDateString('zh-CN'),
      content: (paper.body as any)?.raw ?? '',
    })),
    ...allExperiments.map((experiment) => ({
      id: `experiment-${experiment.slug}`,
      title: experiment.title,
      description: experiment.description,
      tags: experiment.tags,
      url: experiment.url,
      category: '实验',
      date: new Date(experiment.date).toLocaleDateString('zh-CN'),
      content: (experiment.body as any)?.raw ?? '',
    })),
  ];

  return allDocuments;
}

export default function SearchPage() {
  const items = buildSearchItems();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">全文搜索</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">在博客、笔记、论文和实验中检索关键字、概念、公式或代码。</p>
      </div>
      <SearchPanel items={items} />
    </main>
  );
}
