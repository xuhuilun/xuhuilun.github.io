# PagedAttention 公式排版优化

## 问题

`content/blog/2026-pagedattention.mdx` 已通过 `remark-math` 和 `rehype-katex` 生成 KaTeX HTML，但根布局没有加载 KaTeX 官方样式。公式内部的定位元素因此退化为普通行内元素，表现为 `softmax`、`Q`、分数等内容逐字分行并出现乱码式排版。

原公式还是一条较长的分式，在窄屏阅读时容易挤压正文区域。

## 方案

### 全局 KaTeX 样式

在 `app/layout.tsx` 引入 `katex/dist/katex.min.css`，让所有 MDX 页面复用同一套公式布局规则。项目已有 `rehype-katex`/`katex` 依赖，不增加新包。

### 公式块响应式样式

在 `styles/globals.css` 的组件层增加阅读区公式规则：

- 公式块使用稳定的上下间距，与正文段落分隔。
- 最大宽度限制为正文宽度，避免撑破页面。
- 公式过宽时允许横向滚动，保留完整数学表达式。
- 公式字号略高于正文，提升论文阅读场景下的辨识度。

### PagedAttention 公式重排

将单行长分式改为 `aligned` 两行：

1. `s_i` 表示第 `i` 个逻辑块的缩放点积得分。
2. `\alpha_i` 表示经过 softmax 归一化后的块级注意力权重。

这样保留原数学含义，同时降低桌面和移动端的横向压力。

## 影响范围

- `app/layout.tsx`：全局加载 KaTeX CSS。
- `styles/globals.css`：新增公式块排版规则。
- `content/blog/2026-pagedattention.mdx`：仅调整块级注意力公式及其引导语。
- `docs/paged-attention-equation-layout.md`：记录设计、根因和验收标准。

不修改其他文章、MDX 解析插件或依赖版本。

## 验收标准

- 页面 HTML 仍包含 `katex-display` 和 `katex-html`。
- 页面加载 CSS 包含 `.katex .base` 与 `.katex-display` 官方布局规则。
- 公式不再出现逐字分行；桌面端居中、移动端过宽时可横向滚动。
- `npm run typecheck` 通过。
- `npm run build` 通过。
- 构建生成的 `.contentlayer` 缓存和 `tsconfig.tsbuildinfo` 不进入提交。
