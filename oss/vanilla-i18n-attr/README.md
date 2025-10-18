# vanilla-i18n-attr · 数据属性国际化

> Zero-dependency i18n for vanilla HTML using `data-*` attributes. · 零依赖、基于 `data-*` 属性的纯前端国际化库。

## Overview · 概述

- **EN:** `vanilla-i18n-attr` scans only the elements you mark with `data-i18n` or `data-i18n-attr`, lazily loads locale dictionaries, and keeps user preferences in `localStorage`. No bundler, no virtual DOM, no dependencies.
- **中文：** `vanilla-i18n-attr` 只会处理带有 `data-i18n` / `data-i18n-attr` 的节点，按需加载 JSON 词典，并把语言偏好存入 `localStorage`。无需打包器或第三方依赖。

A Netlify-ready demo lives in [`demo/`](demo), and the library targets evergreen browsers (Chrome/Edge/Firefox/Safari ≥ 2022 versions).

## Features · 功能

- 🔁 `data-i18n` text replacement & `data-i18n-attr` attribute mapping · 文本与属性翻译
- 📦 Lazy JSON loading with fallback chain (`zh-CN → zh → en`) · 按链式回退加载词典
- 💾 Locale persistence via `localStorage` · 自动记住语言首选项
- ↔️ RTL detection toggles `<html dir>` & `body[data-dir]` · RTL 语言自动切换排版方向
- 🎯 `translateDOM(root)` reuses existing scans for dynamic content · 动态节点增量翻译
- ⚙️ JSDoc typed API with ESM & IIFE builds · 同时提供 ESM / IIFE，带 JSDoc 类型

## Install · 安装

### npm / pnpm / yarn

```bash
npm install vanilla-i18n-attr
# or pnpm add vanilla-i18n-attr
```

```js
import { initI18n } from 'vanilla-i18n-attr';
await initI18n({ basePath: '/locales' });
```

### Direct script (CDN) · 直接引用

```html
<!-- unpkg/jsDelivr once published -->
<script src="https://unpkg.com/vanilla-i18n-attr@0.1.0/dist/vanilla-i18n-attr.min.js"></script>
<script>
  VanillaI18nAttr.initI18n({ basePath: './locales' });
</script>
```

## Usage · 用法

### Markup with data attributes · 使用数据属性标记

```html
<h1 data-i18n="hero.heading">Hello</h1>
<input data-i18n-attr="placeholder:forms.name" placeholder="Your name" />
<button data-i18n="buttons.submit" data-i18n-attr="title:tooltips.submit"></button>
```

```json
// locales/en.json
{
  "hero": { "heading": "Translate static sites in seconds" },
  "forms": { "name": "Your name" },
  "buttons": { "submit": "Send" },
  "tooltips": { "submit": "Send message" }
}
```

### Initialise once · 初始化

```js
import { initI18n, setLocale } from 'vanilla-i18n-attr';

await initI18n({
  basePath: '/locales',
  fallbackLocale: ['en'],
  storageKey: 'demo:locale',
});

// Switch on demand
await setLocale('zh');
```

### Interpolate values · 模板插值

```html
<p data-i18n="messages.greet">Hello</p>
```

```json
{
  "messages": {
    "greet": "Hello, {name}!"
  }
}
```

```js
import { t } from 'vanilla-i18n-attr';

document.querySelector('[data-i18n="messages.greet"]').textContent =
  t('messages.greet', { name: 'Dev' });
```

## API Reference · 接口说明

| Function | Description (EN) | 描述（中文） |
| --- | --- | --- |
| `initI18n(options)` | Configure defaults, auto-detect / restore locale, translate the DOM. Returns the active locale. | 配置默认值、自动检测/恢复语言并翻译 DOM，返回当前语言。 |
| `setLocale(locale)` | Load dictionaries (with fallbacks) and translate tracked nodes. Promise resolving to the active locale. | 加载词典（含回退链）并翻译所有跟踪节点，返回 Promise。 |
| `getLocale()` | Read the currently active locale. | 获取当前语言。 |
| `t(key, vars?)` | Resolve a translation key with optional `{var}` interpolation. | 根据 key 获取翻译，可使用 `{var}` 占位符。 |
| `loadLocale(locale, dict?)` | Manually register a dictionary or lazy-load from `basePath/<locale>.json`. | 手动注入字典，或从 `basePath/<locale>.json` 按需加载。 |
| `translateDOM(root?)` | Scan a subtree for `data-i18n` / `data-i18n-attr` and translate only those nodes. | 扫描子树，翻译其中的 `data-i18n` / `data-i18n-attr` 节点。 |

### Options · 配置

| Option | Type | Default | Notes (EN) | 说明（中文） |
| --- | --- | --- | --- | --- |
| `basePath` | `string` | `"./locales"` | Base directory for JSON dictionaries. | JSON 词典所在目录。 |
| `fallbackLocale` | `string \| string[]` | `['en']` | Additional locales appended to the fallback chain. | 用于回退链的备用语言。 |
| `storageKey` | `string` | `"i18n:locale"` | localStorage key storing the last locale. | 保存最近语言的 localStorage 键名。 |
| `rtlLocales` | `string[]` | `['ar','arc','dv','fa','ha','he','ks','ku','ps','ur','yi']` | RTL locales toggle `<html dir>` + `body[data-dir]`. | RTL 语言列表，自动切换方向。 |
| `noThrow` | `boolean` | `true` | When `false`, missing keys throw (strict mode). | 设为 `false` 时缺失 key 会抛出错误。 |
| `fetcher` | `(url) => Promise<Dictionary>` | native `fetch` | Custom loader for JSON (e.g. cache, transform). | 自定义 JSON 加载器。 |
| `onLocaleChange` | `(locale) => void` | `undefined` | Hook invoked after every successful switch. | 语言切换成功后的回调。 |

### Fallback chain · 回退链

Locale candidates are generated in this order:

1. Active locale (e.g. `zh-CN`)
2. Language part (`zh`)
3. `fallbackLocale` entries (array order preserved)
4. Final safeguard: `en`

缺失 key 会从上述顺序查找，最后返回原文（默认）或抛错（`noThrow: false`）。

## Accessibility & Directionality · 可访问性与方向

- Body gets `data-dir="ltr|rtl"`, convenient for directional CSS tweaks.
- The library never strips existing attributes—missing keys keep the previous content.
- Works with SSR/static HTML: dictionaries fetched only when a locale is requested.

## Demo · 演示

- The Netlify-ready demo lives in [`demo/`](demo) and uses the library via **ESM**.
- An embedded `<iframe>` showcases the **IIFE** bundle with inline dictionaries.
- Run locally with:

```bash
npm run dev
# -> http://localhost:4173
```

## Build · 构建

`dist/vanilla-i18n-attr.js` is maintained by hand. The `build` script simply copies it into `dist/vanilla-i18n-attr.min.js` with a banner header:

```bash
npm run build
```

## Security · 安全

- No external dependencies.
- JSON dictionaries are fetched relative to `basePath`; host on the same origin for tight CSP policies.

## Deployment · 部署

For detailed, step-by-step guides on deploying to Netlify, Cloudflare Pages, GitHub Pages, and for local previews, please see the [**Deployment Guide (DEPLOY.md)**](DEPLOY.md).

## License · 许可证

MIT © 2024 vanilla-i18n-attr / 使用 MIT 授权。
