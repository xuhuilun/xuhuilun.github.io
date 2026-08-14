# LLM论文精读 (xuhuilun.github.io)

基于 Next.js + Tailwind CSS + MDX + Contentlayer 的技术博客，面向 AI / CS 技术学习者的论文笔记与知识库。

## 特性

- MDX 内容工作流（博客 / 笔记 / 论文 / 实验）
- 数学公式（KaTeX）与代码高亮
- 全文搜索（本地索引，无外部依赖）
- 暗色模式
- SEO：sitemap、robots、JSON-LD、Atom 订阅
- Giscus 评论（基于 GitHub Issues）
- GitHub Pages 自动部署

## 快速启动

```bash
npm install --legacy-peer-deps
npm run dev
```

> 说明：`next-contentlayer@0.3.3` 的 peer 依赖为 `next@^12 || ^13`，与 `next@14` 共存需要 `--legacy-peer-deps`。
> Windows 本地构建时若 contentlayer 提示找不到配置，先执行 `$env:PWD = (Get-Location).Path` 再 `npm run build`。

## 目录

- `app/` - Next.js 页面和布局
- `components/` - UI 组件和 MDX 渲染组件
- `content/` - MDX 内容（博客、笔记、论文、实验）
- `lib/` - 站点配置与工具
- `scripts/` - 构建期工具（Atom 订阅源生成）
- `public/img/` - 静态资源（favicon 等）

## 构建与部署

站点以静态导出方式构建到 `out/`，并通过 GitHub Actions 自动部署到 GitHub Pages：

```bash
npm run build   # contentlayer build && next build && 生成 out/atom.xml
```

推送 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布。首次使用请在仓库 Settings → Pages 中把 Source 设为 **GitHub Actions**。

## Giscus 评论

在仓库 Settings → Variables 中配置以下变量（构建时注入，未配置则页面显示提示信息）：

- `NEXT_PUBLIC_GISCUS_REPO`（如 `xuhuilun/xuhuilun.github.io`）
- `NEXT_PUBLIC_GISCUS_REPOSITORY_ID`
- `NEXT_PUBLIC_GISCUS_CATEGORY`
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
