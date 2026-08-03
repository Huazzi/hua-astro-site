---
title: '解决 Codex 反复重连 5 次的问题'
description: '通过 Proxifier 为 Codex 指定 SOCKS5 代理，解决反复重连的问题。'
publishDate: '2026-08-03'
tags:
  - 'Codex'
  - '网络'
  - 'Proxifier'
comment: true
---

> 前提：已具备可用的代理网络环境，且可以正常使用 Codex。

### 原理简单说明

代理工具已经开启，不代表每个桌面程序都会自动走代理。Codex 如果直接连接网络失败，就可能不断尝试重连。

Proxifier 可以为指定程序单独设定网络规则：它会把 Codex 的网络请求转发给本机的 SOCKS5 代理，再由代理连接网络。只要端口和规则配置正确，Codex 就能稳定使用这条连接。

### 解决步骤

#### 1. 下载安装 Proxifier

网址：[Proxifier - The Most Advanced Proxy Client](https://www.proxifier.com/)，下载 Standard Edition。

Proxifier 是付费软件，请使用官方试用版或购买正版授权。

#### 2. 配置 Proxifier

![Proxifier 主界面](./image-20260803103234150.png)

##### 2.1 配置代理服务器

新增一个代理服务器配置：

- **Address**：填代理服务器 IP 地址；本机代理通常填 `127.0.0.1`。
- **Port**：填代理工具提供的 SOCKS 端口。请以自己的代理工具配置为准，例如 `7891`。
- **Protocol**：选择 **SOCKS Version 5**。

![代理服务器配置](./image-20260803104121888.png)

点击 **OK**，完成代理服务器配置。

##### 2.2 配置代理规则

新增一个代理规则：

1. 点击 **Add**。
2. 填写规则名称，例如 `Codex`。
3. 勾选 **Enable**。
4. 点击 **Browse**，找到 Codex（或你实际使用的客户端）的 `.exe` 文件并添加。这样只有该程序的请求会匹配此规则。

![添加程序到规则](./image-20260803105707054.png)

5. 将 Action 选择为刚才配置的代理服务器，例如 `Proxy SOCKS5 127.0.0.1`。

![选择代理服务器](./image-20260803105125482.png)

连续点击 **OK** 保存配置。之后完全退出并重新打开 Codex，再观察是否还会出现反复重连。

#### 3. 设置开机自启动

若不想每次开机后手动启动 Proxifier：

1. 点击顶部菜单栏的 **File**。
2. 勾选 **Autostart**。
