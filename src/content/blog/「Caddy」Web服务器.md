---
title: "「Caddy」Web服务器"
description: "「Caddy」Web服务器"
publishDate: "2025-04-10"
tags:
  - "Web"
  - "Caddy"
comment: true
---

# Caddy：现代化、自动 HTTPS 的 Web 服务器新星！

在构建和部署 Web 应用时，你可能听说过或用过如 **Nginx**、**Apache** 等经典的 Web 服务器。但在今天，有一个越来越受欢迎的新选择——**Caddy**。

本文将带你认识 Caddy，了解它为何成为现代 Web 项目的新宠，并比较它与传统服务器的异同。

------

## 什么是 Caddy？

**Caddy** 是一个由 Go 语言开发的开源 Web 服务器，它以“**自动化、安全、现代**”为核心理念，主打：

- **自动 HTTPS**（内置 Let's Encrypt 证书签发）
- **简单配置语法（Caddyfile）**
- **跨平台支持**
- **内置反向代理、静态文件托管、重定向、负载均衡等功能**

> Caddy 的官方网站：[https://caddyserver.com](https://caddyserver.com/)

------

## 为什么选择 Caddy？

### 1. 自动 HTTPS，告别证书烦恼

传统的 Nginx、Apache 需要你手动申请、续期 HTTPS 证书。Caddy 内置对 Let’s Encrypt 的支持，**开箱即用 HTTPS**，并自动续期，真正做到“配置即上线”。

```caddyfile
example.com {
    reverse_proxy localhost:3000
}
```

只需一行域名，Caddy 会自动获取并配置 SSL 证书，堪称“SSL 小天才”。

------

### 2. 简洁的 Caddyfile 配置

Caddy 用的是自定义配置语法 **Caddyfile**，**类自然语言风格**，非常易读易写。举个例子：

```caddyfile
myapp.com {
    root * /var/www/html
    file_server
    encode gzip zstd
}
```

这就完成了一个网站的静态资源托管和压缩优化。相比 Nginx 的几十行配置，Caddy 的简洁性明显提升开发效率。

------

### 3. 内建反向代理、负载均衡、重定向等功能

无需额外模块，Caddy 原生支持：

- 反向代理（支持健康检查、重试）
- 基础身份验证
- 自动重定向
- URL 重写
- 文件压缩
- 负载均衡等

```caddyfile
api.example.com {
    reverse_proxy backend1:8080 backend2:8080
}
```

------

### 4. 可扩展的模块化架构（插件化）

Caddy 的每一个功能模块都是可插拔的，比如你可以按需添加：

- JSON 日志记录
- 自定义认证模块
- 高级缓存支持

社区还有很多第三方插件可选：https://caddyserver.com/docs/modules/

------

## Caddy 与 Nginx 的对比

| 功能/特性      | **Caddy**                 | **Nginx**                 |
| -------------- | -------------------------- | -------------------------- |
| 自动 HTTPS     | 内置支持，无需配置         | 需要手动申请+cron续期      |
| 配置简洁度     | Caddyfile 非常简洁         | 配置语法略为复杂           |
| 动态配置热更新 | 支持（无需 reload）        | 通常需 `nginx -s reload`   |
| 插件系统       | 模块化、Go 生态丰富        | 第三方模块较多，需编译安装 |
| 静态资源托管   | 内置支持                   | 支持                       |
| 性能与资源占用 | 略高于 Nginx（因自动 TLS） | 高效轻量，成熟度高         |
| 社区与生态     | 新兴、活跃                 | 大而成熟                   |

------

## 🛠 Caddy 的使用场景

- **HTTPS 静态资源托管（个人博客、Hugo/Gatsby）**
- **反向代理前后端分离项目（Vue/React + 后端）**
- **本地开发 HTTPS 测试**
- **快速部署内部服务（如 REST API 接口、文件下载服务）**

------

## 快速开始（安装）

**Linux/macOS**：

```bash
curl -fsSL https://get.caddyserver.com | bash
```

**Windows**：可直接从官网或 Chocolatey 安装。

------

## 示例：部署一个 Vue 应用 + 后端 API

```caddyfile
example.com {
    root * /var/www/vue-app/dist
    file_server

    handle /api/* {
        reverse_proxy localhost:8080
    }
}
```

效果：

- `https://example.com/`：访问前端页面
- `https://example.com/api/users`：由 Caddy 代理给后端接口

