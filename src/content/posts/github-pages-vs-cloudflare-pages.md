---
title: GitHub Pages 和 Cloudflare Pages，我为什么同时用？
description: 两个静态托管平台都能免费上线网站，但它们的构建方式、自定义域名、缓存和运维成本不一样。这是我实际使用后的选择清单。
pubDate: 2026-11-11
category: 技术实践
tags: ["GitHub Pages", "Cloudflare Pages", "部署", "静态网站"]
featured: false
projectName: VocabFan Hub
projectUrl: https://hub.vocabfan.online/
---

我的网站全部是静态前端：没有数据库，没有登录，没有自己的服务器。

部署这件事，我同时用了 GitHub Pages 和 Cloudflare Pages。不是因为喜欢折腾，而是因为一开始就是这么做起来的，后来发现两者各有合适的位置。

如果你正在选静态托管，这篇写的是我实际踩过的差别，不是平台参数复读。

## GitHub Pages 适合什么

GitHub Pages 最大的好处是简单：代码在 GitHub，开一个仓库，推上去就能发布。

它适合：

- 纯静态站点、文档、demo
- 代码和站点放在同一个仓库
- 想用 GitHub Actions 做自定义构建
- 希望自己的项目页和 GitHub 身份绑在一起

我的 Hub 和很多小站都放在 GitHub Pages。自定义域名也只需要在仓库里放一个 `CNAME` 文件，再去 DNS 加一条记录。

但它有几个需要提前知道的限制：

- 每个仓库的站点是独立的，多个站点要分别配置
- 构建有配额，复杂项目不适合把它当 CI 用
- 不能像服务器一样自定义响应头、做服务端重定向
- 自定义域名和 HTTPS 需要正确配置，否则会出现证书或跳转问题
- GitHub 的网络和 API 偶尔不稳定，部署失败时要准备备用路径

我遇到过最典型的情况，是 `git push` 一直失败，但 GitHub Contents API 还能用。最后是通过 API 把构建产物提交上去的。

这不是一个优雅的方案，但它说明了一件事：**静态部署的“发布”不一定要绑死在 git push 上。**

## Cloudflare Pages 适合什么

Cloudflare Pages 的心智模型更像一个前端托管平台：

- 连接 GitHub 仓库，自动构建和发布
- 每次提交有独立预览地址
- 自带 CDN、HTTPS 和自定义域名
- 支持 `_headers`、`_redirects` 这类静态配置
- 需要时可以加 Pages Functions

对于有构建步骤的项目，它比 GitHub Pages 顺手。尤其是预览部署：改一个页面，先看预览链接，再决定要不要合并。

我的「不烧心鉴定所」就放在 Cloudflare Pages。它更适合那种“构建产物和源站分开、需要一点边缘能力”的场景。

但 Cloudflare Pages 也不是没有成本：

- 构建配置要写对，根目录、输出目录、Node 版本都可能出问题
- 自定义域名涉及 DNS 和证书，第一次配置要耐心
- 平台能力多，容易被诱导去加不需要的 Functions
- 免费额度够用，但不要把“能加”当成“应该加”

## 一张实际选择表

| 需求 | 更合适的选择 |
| --- | --- |
| 纯静态、代码和站点同仓库 | GitHub Pages |
| 需要预览部署 | Cloudflare Pages |
| 需要自定义响应头/重定向 | Cloudflare Pages |
| 多个小站、想低成本维护 | 两者都行，按已有习惯 |
| 需要边缘函数 | Cloudflare Pages |
| 只想最快上线一个页面 | GitHub Pages |

这张表不是绝对的。真正的决定因素通常是：**你以后会不会经常改它。**

一个一年不动一次的静态页，放哪里都行。一个每周都要发文章、改样式、看预览的博客，构建体验就很重要。

## 我为什么同时用

一半是历史原因。

早期站点都在 GitHub Pages，迁移的成本大于收益。后来新项目需要预览和更灵活的静态配置，才开始用 Cloudflare Pages。

另一半是风险分散。

两个平台都免费，都支持自定义域名。把全部站点绑在一个平台上，遇到构建故障或账号问题时没有退路。分开之后，至少不会同时全挂。

但我不建议为了“分散风险”把同一个站点部署两份。那会带来重复内容、canonical 混乱和双倍维护成本。**分散的是不同站点，不是同一个页面的多个副本。**

## 如果今天从零做一个博客

我会选：

- **Astro** 做静态生成
- **Markdown** 写文章
- **GitHub** 存代码和版本
- **Cloudflare Pages** 自动构建和部署
- 自定义域名用子域名，比如 `blog.example.com`

原因不是 Cloudflare 一定比 GitHub Pages 快，而是博客会持续更新，预览部署和构建配置的体验更重要。

Astro 的好处是默认输出静态 HTML，客户端 JavaScript 很少；内容用 Markdown 管理，不需要数据库和后台。对一个人维护的博客来说，这比“功能齐全的 CMS”更可持续。

## 部署检查清单

不管选哪个平台，上线前至少检查这些：

1. `site`/`base` 配置是否正确，静态资源路径有没有 404
2. 自定义域名是否完成 DNS 和 HTTPS
3. 每个页面是否有自己的 canonical
4. `sitemap.xml` 是否只包含正式页面
5. `robots.txt` 是否允许抓取，并指向 sitemap
6. 404 页面是否存在，旧链接是否会静默失败
7. `ads.txt`、统计脚本等根目录文件是否能访问
8. 移动端和慢网下是否还能用

## 几个容易踩的坑

**绝对路径。** 部署在子目录时，`/assets/app.js` 会指向域名根目录，而不是项目目录。Vite/Astro 项目要正确设置 `base`，或者用相对路径。

**SPA 回退。** 单页应用把所有路径都重写到 `index.html`，静态博客不需要这个。配错了会让 404 页面失效，也会让搜索引擎抓到重复内容。

**缓存。** 静态资源可以长缓存，HTML 不要长缓存。改完标题却发现线上还是旧页面，通常不是没部署，而是缓存。

**canonical。** 同一篇文章不要同时挂在两个域名或两个路径下。选一个主版本，其他版本重定向。

**平台不是备份。** 代码在 GitHub，构建产物在平台，文章源文件也要在本地或仓库里。不要把唯一副本放在某个后台编辑器里。

## 结论

GitHub Pages 和 Cloudflare Pages 都能把静态网站跑起来。真正要选的是工作流：

- 想少配置、和代码仓库绑定：GitHub Pages
- 想要预览、构建和边缘能力：Cloudflare Pages
- 博客这种持续更新的内容站：我会选 Cloudflare Pages + Astro

工具不是身份。能稳定发布、能持续维护、出问题时有备用路径，比“用了哪个平台”重要得多。

---

参考：

- [GitHub Pages 使用限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Astro 部署到 Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/)
