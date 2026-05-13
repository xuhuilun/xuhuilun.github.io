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
var createDocumentType = (name, filePathPattern, urlPrefix) => defineDocumentType(() => ({
  name,
  filePathPattern,
  contentType: "mdx",
  fields: {
    ...defaultFields,
    series: { type: "string", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(new RegExp(`^${urlPrefix}/`), "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/${urlPrefix}/${doc._raw.flattenedPath.replace(new RegExp(`^${urlPrefix}/`), "")}`
    }
  }
}));
var Blog = createDocumentType("Blog", "blog/**/*.mdx", "blog");
var Note = createDocumentType("Note", "notes/**/*.mdx", "notes");
var Paper = createDocumentType("Paper", "papers/**/*.mdx", "papers");
var Experiment = createDocumentType("Experiment", "experiments/**/*.mdx", "experiments");
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
//# sourceMappingURL=compiled-contentlayer-config-SSNEDX5X.mjs.map
