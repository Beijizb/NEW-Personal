# Geek Personal Homepage

Indie developer building a minimalist, hacker‑style personal homepage. Zero‑dependency static site ready for one‑click deployment to Cloudflare Pages or Netlify.

## Features

- Minimal, fast, and privacy‑friendly static site (no build, no tracking)
- Hacker/geek‑style design with keyboard‑like monospace aesthetics
- Dark/Light theme toggle with local preference persistence
- i18n ready: English/Chinese switch, content driven by `data-i18n`
- Quick‑access links section for daily navigation (customizable)
- Accessible HTML structure (skip links, focus states, ARIA labels)
- One‑click deploy to Netlify; zero‑config deploy to Cloudflare Pages

## Tech Stack

- Pure HTML + CSS + Vanilla JS (no frameworks, no dependencies)
- Edge‑hosting friendly, works on Netlify/Cloudflare Pages out of the box
- Security headers via Netlify `_headers` / `netlify.toml`

## Why apply for Open‑Source plan

- Provide a free, fast starter for indie developers to publish personal pages
- Demo and documentation hosting to lower onboarding costs for newcomers
- Keep the project ad‑free and privacy‑friendly for the community

## Links for application reviewers

- Code of Conduct: `CODE_OF_CONDUCT.md`
- License: `LICENSE` (MIT)
- Contributing Guide: `CONTRIBUTING.md`
- Netlify one‑click deploy: see section "Deploy to Netlify"
- Proof of contributors: GitHub Contributors page of the repository

> Tip: After pushing to GitHub, the contributors page is available at: `https://github.com/Beijizb/NEW-Personal/graphs/contributors`

## Local Preview

- Choose one of the following methods:
  - Directly open `index.html` (some APIs like clipboard won't work with `file://` protocol).
  - Use any static server (recommended):

```bash
# Python
python -m http.server 8080
# Node.js (http-server)
npx --yes http-server -p 8080 .
```

Visit `http://localhost:8080`.

## Deploy to Cloudflare Pages

1. Login to Cloudflare Dashboard, go to Pages.
2. Select "Create a project" → "Upload assets" (no repository binding required).
3. Upload the entire directory (including `index.html`, `styles.css`, `script.js`, `assets/`).
4. Leave Build command empty; set Build output directory to `/` (project root).
5. Access the assigned domain after completion.

> For Git repository method: Framework select "None", leave Build command empty, Output directory as `/`.

## Deploy to Netlify

- One-click deploy:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Beijizb/NEW-Personal)

- Method A: Drag & Drop
  1. Login to Netlify → Sites → Add new site → Deploy manually.
  2. Drag the entire directory to upload.

- Method B: Connect Git Repository
  1. Create a new repository and push project files.
  2. Netlify → Add new site → Import an existing project.
  3. Leave Build command empty, set Publish directory to `/` (or repository root).

- Method C: Netlify CLI

```bash
npm i -g netlify-cli
netlify deploy --dir=. --prod
```

## Customization

- Content & Links: Edit personal information, project cards, and social links in `index.html`.
- Theme Colors: Adjust `--accent` and other colors in `styles.css` `:root` variables.
- Avatar/Icons: Replace `assets/avatar.svg`, `assets/favicon.svg`.

## Contributing & Open Source

- License: See `LICENSE` (MIT)
- Contributing Guide: See `CONTRIBUTING.md`
- Code of Conduct: See `CODE_OF_CONDUCT.md`

## Contact

- Maintainer: Indie developer
- Issues/Requests: GitHub Issues of this repository
- Deploy help: open an issue with your Netlify/Cloudflare setup details

## License

MIT

---

## 中文说明

一个零依赖、可直接部署到静态托管（Cloudflare Pages / Netlify）的极客风个人主页。

### 本地预览

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

### 部署到 Cloudflare Pages

1. 登录 Cloudflare Dashboard，进入 Pages。
2. 选择 "Create a project" → "Upload assets"（无需绑定仓库）。
3. 将整个目录上传（包含 `index.html`、`styles.css`、`script.js`、`assets/`）。
4. Build command 留空；Build output directory 设为 `/`（项目根）。
5. 完成后即可访问分配的域名。

> 若使用 Git 仓库方式：Framework 选择 "None"，Build command 留空，Output directory 为 `/`。

### 部署到 Netlify

- 一键部署：

[![一键部署到 Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Beijizb/NEW-Personal)

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

### 自定义

- 文案与链接：编辑 `index.html` 中的个人信息、项目卡片与社交链接。
- 主题色：在 `styles.css` 的 `:root` 变量中调整 `--accent` 等颜色。
- 头像/图标：替换 `assets/avatar.svg`、`assets/favicon.svg`。

### 贡献与开源

- 许可协议：见 `LICENSE`（MIT）
- 贡献指南：见 `CONTRIBUTING.md`
- 行为准则：见 `CODE_OF_CONDUCT.md`

---

[![Deploys by Netlify](https://www.netlify.com/assets/badges/netlify-badge-color-accent.svg)](https://www.netlify.com)
