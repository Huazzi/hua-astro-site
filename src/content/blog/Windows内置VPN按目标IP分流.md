---
slug: '581695'
title: 'Windows 内置 VPN 按目标 IP 分流'
description: '使用 Windows 内置 VPN 的拆分隧道配合 /32 路由，让公司内网 IP 走 VPN，其余外网流量继续由 Clash 等代理处理，并附验证与回滚步骤。'
publishDate: '2026-11-01'
tags:
  - 'Windows'
  - 'VPN'
  - 'PowerShell'
  - '网络'
---

## 目标

Windows 自带 VPN 只负责访问指定的公司内网 IP；其他外网连接继续走本机网络，并由 Clash 等代理客户端处理。这里使用 Windows 路由实现按目标 IP 分流，不需要预先知道完整公司内网网段。

适用于 Windows「设置」中创建的内置 VPN 配置。公司 VPN 策略可能禁止分流；请遵守组织要求。示例中的 VPN 名称和 IP 仅供替换参考。

## 原理

- `SplitTunneling = True`：VPN 不再默认接管所有目的地址。
- 给 VPN 配置添加 `/32` 路由：每条路由只匹配一个 IPv4 地址，并在 VPN 连接时经该 VPN 接口访问。
- 未匹配这些路由的流量使用其他可用网络路径；若 Clash 的系统代理或 TUN 正常工作，外网流量继续由 Clash 代理。
- `10.x.x.x` 是私有地址，但不代表公司网络中所有 `10.x.x.x` 都应走 VPN。只添加实际需要访问且已确认的目标 IP，避免误把大量流量导入 VPN。

## 1. 查看 VPN 配置

在 PowerShell 中运行：

```powershell
Get-VpnConnection
```

记下 `Name`、`AllUserConnection` 和 `SplitTunneling`。例如：

```text
Name              : <VPN连接名称>
AllUserConnection : False
SplitTunneling    : False
```

`AllUserConnection : False` 表示这是当前用户的 VPN 配置。后续命令使用 VPN 配置的名称；如果你的配置是所有用户共用，命令可能需要相应的 `-AllUserConnection` 参数。

## 2. 启用分流

以管理员身份打开 PowerShell，执行：

```powershell
Set-VpnConnection -Name "<VPN连接名称>" -SplitTunneling $true
```

把 `<VPN连接名称>` 替换成实际 `Name`。然后确认：

```powershell
Get-VpnConnection -Name "<VPN连接名称>"
```

确认 `SplitTunneling : True`。

## 3. 为需要的内网 IP 添加单地址路由

假设目前需要访问以下地址：

- `<内网IP-1>`
- `<内网IP-2>`
- `<内网IP-3>`
- `<内网IP-4>`

执行：

```powershell
$vpn = "<VPN连接名称>"
$ips = @(
  "<内网IP-1>/32"
  "<内网IP-2>/32"
  "<内网IP-3>/32"
  "<内网IP-4>/32"
)

foreach ($ip in $ips) {
  Add-VpnConnectionRoute -ConnectionName $vpn -DestinationPrefix $ip
}
```

将示例 IP 换成实际需要经公司内网访问的 IPv4 地址。`/32` 是单个 IPv4 地址的前缀长度，因此只影响精确匹配的地址。每增加一个目标 IP，就为它添加一条 `/32` 路由。该命令将路由关联到 VPN 配置，不必猜测 VPN 的网关地址。

## 4. 验证

断开并重新连接 VPN。确认 VPN 已连接后，查看活动路由：

```powershell
Get-NetRoute -AddressFamily IPv4 |
  Where-Object DestinationPrefix -in $ips |
  Format-Table DestinationPrefix, InterfaceAlias, NextHop, RouteMetric
```

目标路由应显示 VPN 的接口别名（例如 `<VPN连接名称>`）。也可查看完整路由表：

```powershell
route print
```

测试 HTTP 地址的 TCP 端口（HTTP 默认 80）：

```powershell
Test-NetConnection <内网IP-1> -Port 80
Test-NetConnection <内网IP-2> -Port 80
Test-NetConnection <内网IP-3> -Port 80
Test-NetConnection <内网IP-4> -Port 80
```

如果服务使用 HTTPS，将端口改为 `443`。检查 `TcpTestSucceeded`，并在浏览器中测试实际 URL。同时检查 Clash 代理的外网访问是否正常。

## 常见情况

- **路由可见但服务无法连接**：路由只决定流量走哪个接口，不保证服务器可达。确认 VPN 已连接、目标 IP/端口正确、公司账号有访问权限，并询问 IT 是否还需其他网段或访问策略。
- **IP 可达但内网域名无法访问**：可能需要公司 DNS、DNS 后缀或名称解析策略。向 IT 获取准确配置，不要猜测 DNS 地址。
- **外网未走 Clash**：检查 Clash 的系统代理/TUN 设置和运行状态。Windows 分流只决定哪些目标送入 VPN；Clash 是否接管其余流量取决于客户端配置。
- **设置被拒绝或重连后恢复全隧道**：检查命令是否在正确用户上下文运行；个人设备上的 VPN 也可能受服务端或组织策略管理，需联系 IT 确认是否允许分流。
- **同一个内网 IP 段与本地网络冲突**：Windows 会按路由匹配和优先级选路，单 IP 路由通常比更宽的网段更具体，但仍需连接后实际验证。

## 移除已添加的路由 / 回滚

只移除先前明确添加的路由：

```powershell
$vpn = "<VPN连接名称>"
$ips = @(
  "<内网IP-1>/32"
  "<内网IP-2>/32"
  "<内网IP-3>/32"
  "<内网IP-4>/32"
)

foreach ($ip in $ips) {
  Remove-VpnConnectionRoute -ConnectionName $vpn -DestinationPrefix $ip -Confirm:$false
}
```

如需恢复为全隧道（让 VPN 再次默认承载所有流量），执行：

```powershell
Set-VpnConnection -Name "<VPN连接名称>" -SplitTunneling $false
```

恢复全隧道前，可先移除自己添加的路由。完成后断开并重连 VPN。

## 参考

- [Microsoft Learn：VPN routing decisions](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/vpn/vpn-routing)
- [Microsoft Learn：Set-VpnConnection](https://learn.microsoft.com/en-us/powershell/module/vpnclient/set-vpnconnection)
- [Microsoft Learn：Add-VpnConnectionRoute](https://learn.microsoft.com/en-us/powershell/module/vpnclient/add-vpnconnectionroute)
- [Microsoft Learn：Remove-VpnConnectionRoute](https://learn.microsoft.com/en-us/powershell/module/vpnclient/remove-vpnconnectionroute)
