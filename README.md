# 极客风个人主页

Indie developer building a minimalist, hacker‑style personal homepage. Zero‑dependency static site ready for one‑click deployment to Cloudflare Pages or Netlify.

一个零依赖、可直接部署到静态托管（Cloudflare Pages / Netlify）的极客风个人主页。

## Features (EN)

- Minimal, fast, and privacy‑friendly static site (no build, no tracking)
- Hacker/geek‑style design with keyboard‑like monospace aesthetics
- Dark/Light theme toggle with local preference persistence
- i18n ready: English/Chinese switch, content driven by `data-i18n`
- Quick‑access links section for daily navigation (customizable)
- Accessible HTML structure (skip links, focus states, ARIA labels)
- One‑click deploy to Netlify; zero‑config deploy to Cloudflare Pages

## Tech Stack (EN)

- Pure HTML + CSS + Vanilla JS (no frameworks, no dependencies)
- Edge‑hosting friendly, works on Netlify/Cloudflare Pages out of the box
- Security headers via Netlify `_headers` / `netlify.toml`

## Why apply for Open‑Source plan (EN)

- Provide a free, fast starter for indie developers to publish personal pages
- Demo and documentation hosting to lower onboarding costs for newcomers
- Keep the project ad‑free and privacy‑friendly for the community

## Links for application reviewers (EN)

- Code of Conduct: `CODE_OF_CONDUCT.md`
- License: `LICENSE` (MIT)
- Contributing Guide: `CONTRIBUTING.md`
- Netlify one‑click deploy: see section “部署到 Netlify”
- Proof of contributors: GitHub Contributors page of the repository

> Tip: After pushing to GitHub, the contributors page is available at: `https://github.com/Beijizb/NEW/graphs/contributors`

## 本地预览

- 任选其一方式打开：
  - 直接双击 `index.html`（部分 API 如剪贴板在 `file://` 下不可用）。
  - 使用任意静态服务器（推荐）：

```bash
# Python
python -m http.server 8080
# Node.js (http-server)
npx --yes http-server -p 8080 .
```

访问 `http://localhost:8080`。

## 部署到 Cloudflare Pages

1. 登录 Cloudflare Dashboard，进入 Pages。
2. 选择 "Create a project" → "Upload assets"（无需绑定仓库）。
3. 将整个目录上传（包含 `index.html`、`styles.css`、`script.js`、`assets/`）。
4. Build command 留空；Build output directory 设为 `/`（项目根）。
5. 完成后即可访问分配的域名。

> 若使用 Git 仓库方式：Framework 选择 "None"，Build command 留空，Output directory 为 `/`。

## 部署到 Netlify

- 一键部署：

[![一键部署到 Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Beijizb/NEW)

- 方式 A：拖拽上传
  1. 登录 Netlify → Sites → Add new site → Deploy manually。
  2. 将整个目录拖入上传。

- 方式 B：连接 Git 仓库
  1. 新建仓库并推送本项目文件。
  2. Netlify → Add new site → Import an existing project。
  3. Build command 留空，Publish directory 设为 `/`（或仓库根）。

- 方式 C：Netlify CLI

```bash
npm i -g netlify-cli
netlify deploy --dir=. --prod
```

## 自定义

- 文案与链接：编辑 `index.html` 中的个人信息、项目卡片与社交链接。
- 主题色：在 `styles.css` 的 `:root` 变量中调整 `--accent` 等颜色。
- 头像/图标：替换 `assets/avatar.svg`、`assets/favicon.svg`。

## 贡献与开源

- 许可协议：见 `LICENSE`（MIT）
- 贡献指南：见 `CONTRIBUTING.md`
- 行为准则：见 `CODE_OF_CONDUCT.md`

## Contact (EN)

- Maintainer: Indie developer
- Issues/Requests: GitHub Issues of this repository
- Deploy help: open an issue with your Netlify/Cloudflare setup details

## 许可

MIT

---

[![This site is powered by Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
