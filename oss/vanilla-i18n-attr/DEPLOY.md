# Deployment Guide (EN)

This guide provides step-by-step instructions for deploying the `vanilla-i18n-attr` project. As a static project with no build process, deployment is straightforward.

**Key Settings:**

*   **Base Directory:** `oss/vanilla-i18n-attr`
*   **Publish Directory:** `demo`
*   **Build Command:** None required.

---

## Netlify

### 1. Web UI Method

1.  **Fork this repository.**
2.  Log in to your Netlify account and click "**Add new site**" > "**Import an existing project**".
3.  Connect your Git provider (GitHub, GitLab, etc.).
4.  Select your forked repository.
5.  Configure site settings:
    *   **Base directory:** `oss/vanilla-i18n-attr`
    *   **Publish directory:** `demo`
    *   **Build command:** Leave this field empty.
6.  Click "**Deploy site**". Netlify will automatically deploy your project.

### 2. Netlify CLI

1.  **Install Netlify CLI:**
    ```bash
    npm install netlify-cli -g
    ```
2.  **Log in:**
    ```bash
    netlify login
    ```
3.  **Deploy:**
    Run the following command from the root of this repository:
    ```bash
    netlify deploy --prod --dir=oss/vanilla-i18n-attr/demo
    ```
    When prompted, you can either link it to an existing site or create a new one.

### `netlify.toml` Configuration

For convenience, a `netlify.toml` file is included in `oss/vanilla-i18n-attr`. This file pre-configures the deployment settings and security headers.

```toml
[build]
  command = ""
  publish = "demo"

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## Cloudflare Pages

1.  **Fork this repository.**
2.  Log in to your Cloudflare dashboard and go to **Workers & Pages**.
3.  Click "**Create application**" > "**Pages**" > "**Connect to Git**".
4.  Select your forked repository.
5.  In the "**Set up builds and deployments**" section:
    *   **Project name:** Your choice.
    *   **Production branch:** Select your desired branch.
    *   **Framework preset:** `None`
    *   **Build command:** Leave empty.
    *   **Build output directory:** `oss/vanilla-i18n-attr/demo`
6.  Click "**Save and Deploy**".

---

## GitHub Pages (with GitHub Actions)

1.  **Fork this repository.**
2.  Go to your repository's "**Settings**" > "**Pages**".
3.  Under "**Build and deployment**", set the **Source** to "**GitHub Actions**".
4.  Create a workflow file `.github/workflows/deploy.yml` with the following content:

    ```yaml
    name: Deploy to GitHub Pages

    on:
      push:
        branches:
          - main # Or your default branch

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout 🛎️
            uses: actions/checkout@v3

          - name: Deploy 🚀
            uses: JamesIves/github-pages-deploy-action@v4
            with:
              branch: gh-pages # The branch the action should deploy to.
              folder: oss/vanilla-i18n-attr/demo # The folder the action should deploy.
    ```
    This action will automatically deploy the contents of `oss/vanilla-i18n-attr/demo` to the `gh-pages` branch, which will then be served by GitHub Pages.

---

## Local Preview

To preview the site locally, you can use any simple web server.

1.  **Using Python:**
    ```bash
    # From the root of this repository
    python3 -m http.server --directory oss/vanilla-i18n-attr/demo
    ```
2.  **Using Node.js (`serve` package):**
    ```bash
    # Install serve globally
    npm install -g serve
    # From the root of this repository
    serve oss/vanilla-i18n-attr/demo
    ```
    The site will be available at `http://localhost:8000` (Python) or `http://localhost:3000` (serve).

---

## Troubleshooting & Common Pitfalls

*   **404 Not Found:**
    *   **Problem:** The server cannot find your `index.html`.
    *   **Solution:** Double-check that your **Publish directory** (or equivalent) is set correctly to `oss/vanilla-i18n-attr/demo`. Ensure you are running commands from the repository root.

*   **Language files not loading (CSP errors):**
    *   **Problem:** The browser's console shows Content Security Policy (CSP) errors, blocking `locales/en.json` or `locales/zh.json`.
    *   **Solution:** Ensure your hosting provider is serving the correct security headers. The `netlify.toml` provided in this project includes a working CSP. If deploying elsewhere, you may need to configure headers manually to allow `fetch` requests to your own origin (`default-src 'self'`).

*   **Incorrect Base Directory:**
    *   **Problem:** Deployment fails or serves the wrong files.
    *   **Solution:** When deploying from a monorepo structure like this one, setting the **Base directory** to `oss/vanilla-i18n-attr` is crucial. This tells the deployment service where to find the `publish` directory (`demo`).

<br>
<hr>
<br>

# 部署指南 (zh)

本指南提供部署 `vanilla-i18n-attr` 项目的详细步骤。作为一个没有构建过程的静态项目，部署过程非常简单。

**关键设置:**

*   **基础目录 (Base Directory):** `oss/vanilla-i18n-attr`
*   **发布目录 (Publish Directory):** `demo`
*   **构建命令 (Build Command):** 无需填写。

---

## Netlify

### 1. 网页界面部署

1.  **Fork 本仓库。**
2.  登录您的 Netlify 账户，点击 "**Add new site**" > "**Import an existing project**"。
3.  连接您的 Git 提供商 (GitHub, GitLab 等)。
4.  选择您 Fork 的仓库。
5.  配置站点设置：
    *   **Base directory:** `oss/vanilla-i18n-attr`
    *   **Publish directory:** `demo`
    *   **Build command:** 将此字段留空。
6.  点击 "**Deploy site**"。Netlify 将自动部署您的项目。

### 2. Netlify CLI

1.  **安装 Netlify CLI:**
    ```bash
    npm install netlify-cli -g
    ```
2.  **登录:**
    ```bash
    netlify login
    ```
3.  **部署:**
    在仓库根目录运行以下命令：
    ```bash
    netlify deploy --prod --dir=oss/vanilla-i18n-attr/demo
    ```
    根据提示，您可以将其链接到现有站点或创建一个新站点。

### `netlify.toml` 配置文件

为了方便起见，`oss/vanilla-i18n-attr` 目录中已包含一个 `netlify.toml` 文件。该文件预先配置了部署设置和安全标头。

```toml
[build]
  command = ""
  publish = "demo"

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## Cloudflare Pages

1.  **Fork 本仓库。**
2.  登录您的 Cloudflare 仪表板，转到 **Workers & Pages**。
3.  点击 "**Create application**" > "**Pages**" > "**Connect to Git**"。
4.  选择您 Fork 的仓库。
5.  在 "**Set up builds and deployments**" 部分：
    *   **Project name:** 自定义。
    *   **Production branch:** 选择您的目标分支。
    *   **Framework preset:** `None`
    *   **Build command:** 留空。
    *   **Build output directory:** `oss/vanilla-i18n-attr/demo`
6.  点击 "**Save and Deploy**"。

---

## GitHub Pages (使用 GitHub Actions)

1.  **Fork 本仓库。**
2.  进入仓库的 "**Settings**" > "**Pages**"。
3.  在 "**Build and deployment**" 下，将 **Source** 设置为 "**GitHub Actions**"。
4.  创建一个名为 `.github/workflows/deploy.yml` 的工作流文件，内容如下：

    ```yaml
    name: Deploy to GitHub Pages

    on:
      push:
        branches:
          - main # 或您的默认分支

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout 🛎️
            uses: actions/checkout@v3

          - name: Deploy 🚀
            uses: JamesIves/github-pages-deploy-action@v4
            with:
              branch: gh-pages # 操作应部署到的分支。
              folder: oss/vanilla-i18n-attr/demo # 操作应部署的文件夹。
    ```
    此操作会自动将 `oss/vanilla-i18n-attr/demo` 目录的内容部署到 `gh-pages` 分支，GitHub Pages 将从该分支提供服务。

---

## 本地预览

您可以使用任何简单的 Web 服务器在本地预览站点。

1.  **使用 Python:**
    ```bash
    # 从仓库根目录运行
    python3 -m http.server --directory oss/vanilla-i18n-attr/demo
    ```
2.  **使用 Node.js (`serve` 包):**
    ```bash
    # 全局安装 serve
    npm install -g serve
    # 从仓库根目录运行
    serve oss/vanilla-i18n-attr/demo
    ```
    站点将在 `http://localhost:8000` (Python) 或 `http://localhost:3000` (serve) 上可用。

---

## 问题排查与常见陷阱

*   **404 Not Found (未找到):**
    *   **问题:** 服务器找不到您的 `index.html` 文件。
    *   **解决方案:** 仔细检查您的 **Publish directory** (或等效设置) 是否正确设置为 `oss/vanilla-i18n-attr/demo`。确保您是从仓库根目录运行命令。

*   **语言文件加载失败 (CSP 错误):**
    *   **问题:** 浏览器控制台显示内容安全策略 (CSP) 错误，阻止了 `locales/en.json` 或 `locales/zh.json` 的加载。
    *   **解决方案:** 确保您的托管服务商提供了正确的安全标头。本项目中提供的 `netlify.toml` 包含一个可用的 CSP 配置。如果部署在其他平台，您可能需要手动配置标头，以允许 `fetch` 请求访问您自己的源 (`default-src 'self'`)。

*   **基础目录 (Base Directory) 不正确:**
    *   **问题:** 部署失败或提供了错误的文件。
    *   **解决方案:** 在部署类似本项目的单体仓库结构时，将 **Base directory** 设置为 `oss/vanilla-i18n-attr` 至关重要。这会告诉部署服务在哪里可以找到 `publish` 目录 (`demo`)。
