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
- `content/` - MDX 博客内容
- `components/` - UI 组件和 MDX 渲染组件
- `lib/` - 站点配置与工具

## 说明

当前仓库中仍保留旧静态站点目录，重构将以 `app/` 下的新 Next.js 项目为主。
