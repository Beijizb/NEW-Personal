# Contributing to vanilla-i18n-attr / 贡献指南

Thanks for helping keep `vanilla-i18n-attr` lightweight and friendly!
感谢你为 `vanilla-i18n-attr` 做出的贡献。

## Getting started / 入门

1. Fork & clone the repository · 派生并克隆项目。
2. Work inside `oss/vanilla-i18n-attr` to keep the footprint isolated.
3. Use `npm run dev` to serve the demo locally · 使用 `npm run dev` 本地预览。
4. Run `npm run build` before opening a PR so the IIFE copy stays in sync.

## Pull requests / 提交 PR

- Keep changes focused and document behaviour in the PR description.
- Add or update examples in `demo/` when introducing a new feature.
- Follow the existing code style (monospace aesthetic, no trailing spaces).
- 提交前请确保：变更聚焦、在 PR 中说明行为，并在 `demo/` 中更新示例。

## Commit messages / 提交信息

- Use clear, descriptive messages (English preferred, bilingual welcome).
- 示例：`feat: support onLocaleChange hook`。

## Testing / 测试

- Manual testing in the latest Chrome/Firefox/Safari is sufficient for now.
- 请手动在现代浏览器中验证主要功能（语言切换、fallback、RTL）。

Happy hacking! 快乐开发！
