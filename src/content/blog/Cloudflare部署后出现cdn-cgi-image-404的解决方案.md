---
title: "Cloudflare部署后出现cdn-cgi-image 404的解决方案"
description: "记录 Astro 项目部署到 Cloudflare 后，浏览器控制台出现 /cdn-cgi/image/... 404 的原因和修复方式"
publishDate: "2026-06-02"
tags:
  - "Cloudflare"
  - "Astro"
  - "图片"
  - "部署"
---

## 问题现象

把 Astro 项目部署到 Cloudflare 之后，浏览器控制台里会出现类似这样的报错：

```text
GET https://xxx.workers.dev/cdn-cgi/image/onerror=redirect,width=640,height=640,format=webp/_astro/avatar.xxx.png 404 (Not Found)
```

表面上看起来像是头像文件丢了，但实际上文件本身通常是存在的，真正出问题的是 Cloudflare 的图片处理方式。

## 原因分析

这个项目里首页头像使用的是 Astro 的图片资源能力，图片源文件放在 `src/assets/avatar.png`，然后在首页通过 `astro:assets` 进行处理。

问题出在 Cloudflare adapter 的配置：

```ts
adapter: cloudflare({ imageService: 'cloudflare' })
```

这个选项会让图片在运行时走 Cloudflare Image Resizing，于是页面里生成的图片地址会变成 `/cdn-cgi/image/...` 这种形式。

如果当前部署环境没有正确提供这条图片处理链路，或者你并不打算依赖 Cloudflare 的运行时图片重写，就会看到这个 404。

## 解决方案

最直接的修复方式，是把图片服务改成构建期编译：

```ts
adapter: cloudflare({ imageService: 'compile' })
```

这样 Astro 会在构建时预处理图片，生成静态可用的资源，部署后不会再依赖 `/cdn-cgi/image/...` 这条运行时路径。

我这边实际修改的是 `astro.config.ts`：

```ts
adapter: cloudflare({ imageService: 'compile' }),
```

## 验证结果

改完之后重新执行构建，日志里会明确提示：

```text
[@astrojs/cloudflare] Enabling compile-time image optimization. Images will be pre-optimized at build time.
```

构建可以正常通过，首页头像也会改为走构建产物，不再请求 `/cdn-cgi/image/...`，控制台里的 404 就消失了。

## 补充说明

浏览器控制台里偶尔还会看到一些和页面无关的提示，比如浏览器扩展注入脚本、Chrome 的内置功能提示，这些通常不是站点本身的问题，可以先忽略。

如果你的站点确实想使用 Cloudflare 的运行时图片能力，也可以继续保留 `cloudflare` 模式，但那要求对应的图片服务链路必须完整可用。对于这种以静态内容为主的博客，`compile` 一般更稳。