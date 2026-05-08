import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const defaultFields = {
  title: { type: 'string', required: true },
  description: { type: 'string', required: true },
  date: { type: 'date', required: true },
  tags: { type: 'list', of: { type: 'string' }, required: true },
  draft: { type: 'boolean', required: false, default: false },
};

const contentTypeOptions = {
  contentType: 'mdx' as const,
};

const createDocumentType = (name: string, filePathPattern: string, urlPrefix: string) =>
  defineDocumentType(() => ({
    name,
    filePathPattern,
    contentType: 'mdx',
    fields: {
      ...defaultFields,
      series: { type: 'string', required: false },
    },
    computedFields: {
      slug: {
        type: 'string',
        resolve: (doc) => doc._raw.flattenedPath.replace(new RegExp(`^${urlPrefix}\/`), ''),
      },
      url: {
        type: 'string',
        resolve: (doc) => `/${urlPrefix}/${doc._raw.flattenedPath.replace(new RegExp(`^${urlPrefix}\/`), '')}`,
      },
    },
  }));

export const Blog = createDocumentType('Blog', 'blog/**/*.mdx', 'blog');
export const Note = createDocumentType('Note', 'notes/**/*.mdx', 'notes');
export const Paper = createDocumentType('Paper', 'papers/**/*.mdx', 'papers');
export const Experiment = createDocumentType('Experiment', 'experiments/**/*.mdx', 'experiments');

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Note, Paper, Experiment],
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, rehypeHighlight],
  },
});
