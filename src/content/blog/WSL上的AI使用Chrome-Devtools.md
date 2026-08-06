---
slug: "598999"
aliases:
  - wsl上的ai使用chrome-devtools
title: "WSL2 里的 AI 实现直接控制 Windows Chrome的方法"
description: "别被环境隔离骗了：WSL2 里的 AI，照样能直接控制 Windows Chrome"
publishDate: "2025-05-22"
tags:
  - "vim"
---

## 摘要

代码在 WSL2 中运行，AI agent 也在 WSL2 中，但浏览器使用 Windows 端的 Chrome。核心问题在于浏览器接管环节——许多工具会先去 Linux 环境找 Chrome，导致失败。

**推荐方案：**

- Windows 手动启动专用调试 Chrome
- 该 Chrome 开启远程调试端口（如 `9922`）
- 使用独立 `user-data-dir`
- WSL2 中的 `chrome-devtools-mcp` 仅通过 `--browser-url` 连接

---

## 一、确认环境

### 1. Windows 已安装 Google Chrome

`chrome-devtools-mcp` 官方明确支持的是 **Google Chrome** 和 **Chrome for Testing**，建议统一使用 Google Chrome。

### 2. WSL2 有可用的 Node.js、npm、npx

要求 Node.js 为 **20.19 或更高的维护中 LTS**。在 WSL2 中依次执行：

```bash
node -v
npm -v
npx -y chrome-devtools-mcp@latest --help
```

如果报错，先理顺 Node 环境再继续。

### 3. 确认网络模式：mirrored 还是 NAT

- **Mirrored 模式**：WSL2 可直接访问 `http://127.0.0.1:9922`
- **NAT 模式**：需在 WSL2 中查宿主机 IP：

```bash
ip route show | grep -i default | awk '{ print $3 }'
```

后续地址改为 `http://<Windows宿主机IP>:9922`

如需切换至 mirrored，在 Windows 用户目录下的 `.wslconfig` 中写入：

```ini
[wsl2]
networkingMode=mirrored
```

保存后执行 `wsl --shutdown` 并重新打开 WSL。

---

## 二、在 Windows 上启动调试 Chrome

> **注意**：从 Chrome 136 开始，远程调试开关规则收紧——对默认数据目录启用 `--remote-debugging-port` 或 `--remote-debugging-pipe` 不会生效。必须同时指定一个**非默认**的 `--user-data-dir`。

**PowerShell：**

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9922 `
  --user-data-dir="$env:TEMP\chrome-devtools-mcp-profile"
```

**CMD：**

```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9922 --user-data-dir="%TEMP%\chrome-devtools-mcp-profile"
```

也可创建 Windows 快捷方式，目标填入上述命令。建议将此 Chrome 实例仅用于 AI 和调试，不与日常浏览混用。

---

## 三、先测端口，再配 MCP

浏览器启动后，先在 WSL2 中确认调试端口是否连通。

**Mirrored 模式测试：**

```bash
curl http://127.0.0.1:9922/json/version
```

**NAT 模式测试：**

```bash
HOST_IP=$(ip route show | grep -i default | awk '{ print $3 }')
curl "http://${HOST_IP}:9922/json/version"
```

若能返回 JSON 且包含 `webSocketDebuggerUrl`，说明浏览器准备就绪。若不通，检查：

- Chrome 是否按带参数的命令启动
- `--user-data-dir` 是否为非默认目录
- 当前是 mirrored 还是 NAT
- `.wslconfig` 修改后是否执行过 `wsl --shutdown`

---

## 四、配置 `chrome-devtools-mcp`

AI 客户端支持的标准 MCP JSON 配置格式：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9922"
      ]
    }
  }
}
```

NAT 模式下地址改为 `http://<Windows宿主机IP>:9922`。核心参数是 `--browser-url`，作用是直接连接已启动的 Chrome，而非自行寻找浏览器。

---

## 五、配置 Codex

两种方式：直接编辑 `~/.codex/config.toml` 或使用 `codex mcp add` 命令。

**直接配置（`~/.codex/config.toml`）：**

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9922"]
```

**命令行添加：**

```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9922
```

执行完后建议检查 `~/.codex/config.toml` 确认已写入。

---

## 六、验证是否已连通

建议按顺序验证：

1. 确认包能运行：

   ```bash
   npx -y chrome-devtools-mcp@latest --help
   ```

2. 确认调试端口通畅：

   ```bash
   curl http://127.0.0.1:9922/json/version
   ```

3. 重启 Codex 或让 AI 客户端重新加载 MCP 配置。

4. 给 AI 一个简单任务，如：

   > "打开 https://example.com，查看 Console 是否有报错，再检查一下 Network 请求。"

---

## 七、常见坑

| 问题             | 排查方向                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `curl` 不通      | Chrome 是否使用 `--remote-debugging-port=9922`？是否使用非默认 `--user-data-dir`？网络模式是 mirrored 还是 NAT？     |
| Codex 未加载 MCP | `~/.codex/config.toml` 路径是否正确？TOML 语法是否出错？修改配置后 Codex 是否重启？`npx` 是否卡在首次安装确认？      |
| 端口不一致       | Windows 启动用 `9922`，则 WSL2 中的 `curl`、`--browser-url`、Codex 的 `config.toml` 都须写 `9922`，不能混用 `9222`。 |

**职责划分建议：** Windows 负责启动 Chrome，WSL2 负责运行 AI 和 MCP，`chrome-devtools-mcp` 只负责连接。职责清晰，易于排障。

---

## 总结

四件事：

1. Windows 手动启动专用 Chrome
2. 固定远程调试端口
3. 使用非默认 `user-data-dir`
4. WSL2 中的 MCP 和 Codex 只负责连接已存在的浏览器

---

## 参考文章

- 作者：猿有味（AtomGit开源社区）  
- 原文链接：[https://gitcode.csdn.net/69d0eeb054b52172bc66ee55.html](https://gitcode.csdn.net/69d0eeb054b52172bc66ee55.html)

## 参考资料

1. [Chrome DevTools MCP README](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/README.md)
2. [Chrome DevTools MCP Troubleshooting](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/troubleshooting.md)
3. [Chrome DevTools Protocol 官方文档](https://chromedevtools.github.io/devtools-protocol/)
4. [Chrome 官方：Chrome 136 起远程调试开关的安全变更](https://developer.chrome.com/blog/remote-debugging-port)
5. [Microsoft Learn：WSL Networking](https://learn.microsoft.com/en-us/windows/wsl/networking)
6. [Microsoft Learn：WSL 高级配置 `.wslconfig`](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)
7. [Microsoft Learn：WSL 与 Windows 命令互操作](https://learn.microsoft.com/en-us/windows/wsl/filesystems)