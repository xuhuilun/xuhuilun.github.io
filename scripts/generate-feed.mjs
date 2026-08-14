/**
 * 构建期生成 Atom 订阅源（out/atom.xml）。
 * 在 `next build` 之后执行：npm run build -> ... && node scripts/generate-feed.mjs
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'out');
const SITE_URL = 'https://xuhuilun.github.io';
const SITE_NAME = 'LLM论文精读';
const AUTHOR = 'Lun XuHui';

const CONTENT_TYPES = [
  { dir: 'blog', path: 'blog', label: '博客' },
  { dir: 'notes', path: 'notes', label: '笔记' },
  { dir: 'papers', path: 'papers', label: '论文' },
  { dir: 'experiments', path: 'experiments', label: '实验' },
];

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return null;
  const body = match[1];
  const get = (key) => {
    const m = body.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!m) return undefined;
    let value = m[1].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[')) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        value = [];
      }
    }
    return value;
  };
  return {
    title: get('title'),
    description: get('description'),
    date: get('date'),
    tags: Array.isArray(get('tags')) ? get('tags') : [],
    draft: String(get('draft')).toLowerCase() === 'true',
  };
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function collectEntries() {
  const entries = [];
  for (const type of CONTENT_TYPES) {
    const dir = join(ROOT, 'content', type.dir);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const raw = readFileSync(join(dir, file), 'utf-8');
      const meta = parseFrontmatter(raw);
      if (!meta || !meta.title || !meta.date || meta.draft) continue;
      const slug = file.replace(/\.mdx$/, '');
      entries.push({
        title: meta.title,
        description: meta.description ?? '',
        date: meta.date,
        tags: meta.tags ?? [],
        url: `${SITE_URL}/${type.path}/${slug}/`,
      });
    }
  }
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return entries;
}

function buildFeed(entries) {
  const updated = entries.length ? entries[0].date : new Date().toISOString();
  const entryXml = entries
    .map((entry) => {
      const tags = entry.tags.map((t) => `      <category term="${escapeXml(t)}" />`).join('\n');
      return `  <entry>
    <title>${escapeXml(entry.title)}</title>
    <link href="${entry.url}" rel="alternate" />
    <id>${entry.url}</id>
    <updated>${new Date(entry.date).toISOString()}</updated>
    <published>${new Date(entry.date).toISOString()}</published>
    <summary type="html">${escapeXml(entry.description)}</summary>
${tags}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_NAME)}</title>
  <subtitle>面向 AI / CS 技术学习者的论文笔记与知识库。</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" />
  <link href="${SITE_URL}/" rel="alternate" />
  <id>${SITE_URL}/</id>
  <updated>${new Date(updated).toISOString()}</updated>
  <author>
    <name>${escapeXml(AUTHOR)}</name>
  </author>
${entryXml}
</feed>
`;
}

if (!existsSync(OUT_DIR)) {
  console.warn('[generate-feed] 未找到 out/ 目录，跳过生成（请先运行 next build）。');
  process.exit(0);
}

const entries = collectEntries();
const feed = buildFeed(entries);
writeFileSync(join(OUT_DIR, 'atom.xml'), feed, 'utf-8');
console.log(`[generate-feed] 已生成 out/atom.xml（${entries.length} 篇文章）`);
