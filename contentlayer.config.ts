import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const defaultFields = {
  title: { type: 'string' as const, required: true },
  description: { type: 'string' as const, required: true },
  date: { type: 'date' as const, required: true },
  tags: { type: 'list' as const, of: { type: 'string' as const }, required: true },
  draft: { type: 'boolean' as const, required: false, default: false },
};

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx' as const,
  fields: {
    ...defaultFields,
    series: { type: 'string' as const, required: false },
  },
  computedFields: {
    slug: {
      type: 'string' as const,
      resolve: (doc) => doc._raw.flattenedPath.replace(/^blog\//, ''),
    },
    url: {
      type: 'string' as const,
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//, '')}`,
    },
  },
}));

export const Note = defineDocumentType(() => ({
  name: 'Note',
  filePathPattern: 'notes/**/*.mdx',
  contentType: 'mdx' as const,
  fields: {
    ...defaultFields,
    series: { type: 'string' as const, required: false },
  },
  computedFields: {
    slug: {
      type: 'string' as const,
      resolve: (doc) => doc._raw.flattenedPath.replace(/^notes\//, ''),
    },
    url: {
      type: 'string' as const,
      resolve: (doc) => `/notes/${doc._raw.flattenedPath.replace(/^notes\//, '')}`,
    },
  },
}));

export const Paper = defineDocumentType(() => ({
  name: 'Paper',
  filePathPattern: 'papers/**/*.mdx',
  contentType: 'mdx' as const,
  fields: {
    ...defaultFields,
    series: { type: 'string' as const, required: false },
  },
  computedFields: {
    slug: {
      type: 'string' as const,
      resolve: (doc) => doc._raw.flattenedPath.replace(/^papers\//, ''),
    },
    url: {
      type: 'string' as const,
      resolve: (doc) => `/papers/${doc._raw.flattenedPath.replace(/^papers\//, '')}`,
    },
  },
}));

export const Experiment = defineDocumentType(() => ({
  name: 'Experiment',
  filePathPattern: 'experiments/**/*.mdx',
  contentType: 'mdx' as const,
  fields: {
    ...defaultFields,
    series: { type: 'string' as const, required: false },
  },
  computedFields: {
    slug: {
      type: 'string' as const,
      resolve: (doc) => doc._raw.flattenedPath.replace(/^experiments\//, ''),
    },
    url: {
      type: 'string' as const,
      resolve: (doc) => `/experiments/${doc._raw.flattenedPath.replace(/^experiments\//, '')}`,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Note, Paper, Experiment],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, rehypeHighlight],
  },
});
