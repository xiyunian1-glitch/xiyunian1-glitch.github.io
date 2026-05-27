# 惜余年的个人博客

这是使用 Astro 和 Fuwari 搭建的个人博客，部署在 GitHub Pages。

## 常用命令

```sh
pnpm install
pnpm dev
pnpm build
pnpm new-post <filename>
```

文章放在 `src/content/posts/` 目录下。推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。
