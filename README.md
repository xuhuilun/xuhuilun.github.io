# 辉のblog 重构

这是一个基于 Next.js + Tailwind CSS + MDX + Contentlayer 的技术博客骨架，适合 AI / CS 内容创作与长期知识库演进。

## 特性

- MDX 内容工作流
- 数学公式支持
- 代码高亮
- SEO 友好
- 暗色模式
- GitHub + Vercel 部署路线

## 快速启动

```bash
npm install
npm run dev
```

## 目录

- `app/` - Next.js 页面和布局
- `components/` - UI 组件和 MDX 渲染组件
- `content/` - MDX 内容（博客、笔记、论文、实验）
- `lib/` - 站点配置与工具

## 运行

```bash
npm install
npm run dev
```

## 部署

推荐使用 Vercel：

1. 关联 GitHub 仓库
2. 选择 `main` 分支
3. 配置构建命令 `npm run build`
4. 设置环境变量：
   - `NEXT_PUBLIC_GISCUS_REPO`
   - `NEXT_PUBLIC_GISCUS_REPOSITORY_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY`
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`

## Giscus 评论

使用 `@giscus/react` 集成 GitHub Issues 评论系统。如果未配置环境变量，页面会显示提示信息。

## 说明

当前仓库中仍保留旧静态站点目录，重构将以 `app/` 下的新 Next.js 项目为主。
