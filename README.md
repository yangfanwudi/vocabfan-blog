> 一个人的数字实验室。记录用 AI 和代码开发网站、工具、游戏与数字产品的过程。

## 本地开发

```bash
npm install
npm run dev
```

默认地址：`http://localhost:4321`

## 构建

```bash
npm run build
npm run preview
```

构建输出在 `dist/`。

## 结构

- `src/pages/`：首页、文章列表、文章详情、项目、关于、404
- `src/content/posts/`：Markdown 文章
- `src/content.config.ts`：文章 frontmatter 校验
- `src/components/`：Header / Footer / PostCard
- `src/layouts/BaseLayout.astro`：SEO、OG、JSON-LD、全局布局
- `src/styles/global.css`：视觉与响应式
- `public/`：favicon、OG 图、robots.txt

## 部署

当前部署在 Cloudflare Pages：

- 正式地址：https://blog.vocabfan.online/
- Pages 项目：`vocabfan-blog`
- 预览地址：https://vocabfan-blog.pages.dev/

```bash
npm run build
npx wrangler pages deploy dist --project-name vocabfan-blog --branch main
```

## 文章

新增文章：在 `src/content/posts/` 放一个 `.md` 文件，frontmatter 参考现有文章：

```yaml
---
title: 标题
description: 摘要
pubDate: 2026-11-11
category: 独立开发
tags: ["标签"]
featured: false
projectName: 项目名
projectUrl: https://example.com/
---
```

分类固定为：`独立开发` / `AI 开发` / `技术实践` / `数字实验室`。

## 约定

- 不追 AI 新闻，不做工具导航
- 先写做过的，再谈方法
- 每周一篇，质量优先
- 首页、文章页、项目页、关于页保持轻量，不引入 CMS/评论/登录
