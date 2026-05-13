// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
var defaultFields = {
  title: { type: "string", required: true },
  description: { type: "string", required: true },
  date: { type: "date", required: true },
  tags: { type: "list", of: { type: "string" }, required: true },
  draft: { type: "boolean", required: false, default: false }
};
var Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...defaultFields,
    series: { type: "string", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^blog\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^blog\//, "")}`
    }
  }
}));
var Note = defineDocumentType(() => ({
  name: "Note",
  filePathPattern: "notes/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...defaultFields,
    series: { type: "string", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^notes\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/notes/${doc._raw.flattenedPath.replace(/^notes\//, "")}`
    }
  }
}));
var Paper = defineDocumentType(() => ({
  name: "Paper",
  filePathPattern: "papers/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...defaultFields,
    series: { type: "string", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^papers\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/papers/${doc._raw.flattenedPath.replace(/^papers\//, "")}`
    }
  }
}));
var Experiment = defineDocumentType(() => ({
  name: "Experiment",
  filePathPattern: "experiments/**/*.mdx",
  contentType: "mdx",
  fields: {
    ...defaultFields,
    series: { type: "string", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^experiments\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/experiments/${doc._raw.flattenedPath.replace(/^experiments\//, "")}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Blog, Note, Paper, Experiment],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, rehypeHighlight]
  }
});
export {
  Blog,
  Experiment,
  Note,
  Paper,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-N3OXRA3R.mjs.map
