# Huazzi Site

我的个人博客，使用 Astro 构建，所使用模版为 Astro Theme Pure。

欢迎访问 Huazzi's Site！

> **特别致谢 / Acknowledgements**  
> 本模板项目使用的是开源项目 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)，在此向原作者 [cworld1](https://github.com/cworld1) 表示诚挚的感谢！

## 📄 许可证

查看根目录下的 [LICENSE](./LICENSE) 文件了解详细信息。

## 文章永久链接

博客文章使用 frontmatter 中的 6 位数字 `slug` 作为永久链接：

```yaml
---
slug: '223986'
title: '文章标题'
---
```

运行 `bun run dev`、`bun run build`、`bun run check` 或 `bun run sync` 时，项目会自动为缺少 `slug` 的新文章生成一个不重复的随机 ID，并写回文章文件。已经生成的 `slug` 不会被自动修改；请勿手动更换，以免现有链接失效。

`aliases` 用于保存文章以前使用过的路径，并生成 301 永久重定向：

```yaml
aliases:
  - old-article-path
```

可以单独运行 `bun run permalinks` 检查 ID 格式、重复 ID 和重定向别名冲突。
