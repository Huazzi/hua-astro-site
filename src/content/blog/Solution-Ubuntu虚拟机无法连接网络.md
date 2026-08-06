---
slug: "756305"
aliases:
  - solution-ubuntu虚拟机无法连接网络
title: "Ubuntu虚拟机无法连接网络的「Solution」"
description: "Ubuntu虚拟机无法连接网络的「Solution」"
publishDate: "2025-05-28"
tags:
  - "Ubuntu"
  - "计算机网络"
---


Ubuntu22虚拟机突然无法连接网络了，以下是故障排除步骤记录。


## Ubuntu 22 虚拟机网络“网络不可达”和“域名解析错误”排查解决教程

当在虚拟机中安装的 Ubuntu 22 系统出现“ping: connect: 网络不可达”和“ping: [www.baidu.com](https://www.baidu.com/): 域名解析出现暂时性错误”的报错时，通常意味着虚拟机无法正常连接到外部网络。这可能是由虚拟机软件的网络设置、Ubuntu 内部的网络配置或宿主机的网络状况引起的。

本教程将引导一步步排查并解决这些问题。

### 所需环境与准备

- 安装了 Ubuntu 22 的虚拟机（如 VirtualBox, VMware Workstation/Fusion）。
- 宿主机（运行虚拟机的电脑）能够正常访问互联网。
- 具备基本的 Linux 命令行操作知识。

------

### 排查和解决步骤

#### 第一步：检查虚拟机软件的网络适配器设置 (在您的宿主机上操作)

这是最常见的问题原因。错误的虚拟机网络配置会导致虚拟机无法与宿主机或外部网络建立连接。

1. **关闭您的Ubuntu虚拟机。**
2. **打开您的虚拟机软件** (如 VirtualBox 或 VMware)。
3. **找到您的 Ubuntu 虚拟机**，选中它，然后进入**设置 (Settings)**。
4. **导航到“网络 (Network)”或“网络适配器 (Network Adapter)”部分。**
5. 检查并确认以下关键设置：
   - **适配器已启用/已连接 (Adapter Enabled/Connected):** 确保“启用网络适配器”或“已连接”选项是勾选的。
   - **“数据线已连接 (Cable connected)”或“在启动时连接 (Connect at power on)”：** 确保这个选项是勾选的。
   - 连接方式 (Attached to/Network Connection Type):
     - **推荐首选：NAT (网络地址转换)。** 这是最常用和最简单的设置，它允许虚拟机通过宿主机的网络连接访问互联网，无需复杂的配置。虚拟机通常能自动获取IP地址。
     - **备选方案：桥接模式 (Bridged Adapter)。** 如果NAT不起作用，或者您希望虚拟机在您的物理网络中获得一个独立的IP地址（就像一台真实的电脑一样），可以尝试“桥接模式”。选择此项后，请确保选择正确的宿主机物理网卡进行桥接。
6. **保存设置并重新启动Ubuntu虚拟机。**

#### 第二步：在Ubuntu虚拟机内部检查网络接口状态 (使用 `ip a`)

虚拟机重启后，进入Ubuntu系统，打开终端，执行以下命令来检查网络接口的状态。

1. 检查网卡状态和IP地址：

   ```bash
   ip a
   ```

   - **查看结果：** 寻找一个网络接口（通常是 `ens33`、`enp0s3`、`eth0` 或类似名称）。
   - 确认:
     - 该接口后面是否有 `UP,BROADCAST,RUNING,MULTICAST` 字样，表明网卡处于运行状态。
     - 是否有 `inet` 行，后面跟着一个IP地址（例如 `inet 192.168.x.x/24` 或 `inet 10.0.x.x/24`）。
   - **常见问题：** 如果您的网卡显示 `state DOWN` 且没有 `inet` IP 地址，说明网卡未被激活或未获取到IP。这正是您最初遇到的问题。

#### 第三步：手动激活网卡 (如果网卡是 `DOWN` 状态)

如果第二步中发现您的网卡（例如 `ens33`）显示 `state DOWN` 且没有 IPv4 地址，需要手动将其激活。

1. 手动将网卡激活：

   在Ubuntu终端中输入以下命令（请将 

   ```bash
   sudo ip link set <接口名称> up
   ```

   > 注：<接口名称> #  替换为实际的网卡名称，例如 ens33

2. 再次检查网卡状态：

   激活后，等待几秒钟，然后再次运行 

   ```bash
   ip a
   ```

    命令：

   ```bash
   ip a
   ```

   - **预期结果：** 此时，网卡（例如 `ens33`）应该显示 `UP,BROADCAST,RUNNING,MULTICAST`。这表示网卡已激活。
   - **注意：** 此时它可能仍然没有 IPv4 地址 (`inet` 行)，这是正常现象，我们将在下一步解决。

#### 第四步：强制获取 IPv4 地址 (DHCP 续租)

即使网卡已处于 `UP` 状态，如果没有获取到 IPv4 地址，仍然无法进行网络通信。我们需要强制网卡通过 DHCP 协议请求一个 IP 地址。

1. 释放当前的IP地址（如果有的话）并重新获取：

   在Ubuntu终端中输入以下命令（别忘了将 <接口名称> 替换为实际网卡名称）：

   ```bash
   sudo dhclient -r <接口名称>
   sudo dhclient <接口名称>
   ```

   - `sudo dhclient -r <接口名称>`：这个命令会释放当前网卡可能持有的任何 DHCP 租约。
   - `sudo dhclient <接口名称>`：这个命令会强制网卡向 DHCP 服务器请求一个新的 IP 地址。

2. 再次检查网卡状态和IP地址：

   执行完上述两条命令后，等待几秒钟，然后再次运行 ip a 命令，查看网卡的状态：

   ```bash
   ip a
   ```

   - **预期结果：** 应该能看到在自己的网卡（例如 `ens33`）下方出现了一行 `inet`，后面跟着一个有效的 IPv4 地址（例如 `inet 192.168.220.128/24`），这表明已经成功获取到了 IP 地址。

#### 第五步：检查默认网关和 DNS 服务器 (确认基础网络配置)

现在虚拟机就有 IP 地址了，接下来我们需要确保它有正确的路由和 DNS 配置来访问互联网。

1. 检查默认网关 (Default Gateway)：

   运行以下命令来查看您的默认网关地址：

   ```bash
   ip r
   ```

   - **查看结果：** 寻找一行以 `default via` 开头的记录，例如 `default via 192.168.220.1 dev ens33`。这里的 `192.168.220.1` 就是自己的默认网关地址。

   - 尝试 ping 自己的默认网关：

     ```bash
     ping <自己的网关IP地址>
     # 例如：ping 192.168.220.1
     ```

     - **预期结果：** 如果能正常ping通，说明自己的虚拟机与虚拟路由器之间连接正常。

2. 检查 DNS 服务器 (域名解析)：

   即使可以 ping 通 IP 地址，如果 DNS 服务器有问题，则仍然无法通过域名访问网站。

   ```bash
   resolvectl status
   ```

   - **查看结果：** 在输出中找到自己的网络接口（如 `ens33`），在其下方查找 `DNS Servers` 字段。它应该显示至少一个DNS服务器的IP地址（例如 `8.8.8.8` 或自己的路由器的IP）。

   - 如果DNS服务器为空或不正确，或者 `ping 8.8.8.8` 成功但 `ping www.baidu.com` 仍然失败：

     可以尝试手动编辑 

     ```bash
     /etc/resolv.conf
     ```

      来添加公共 DNS 服务器。

     ```bash
     sudo nano /etc/resolv.conf
     ```

     在文件中添加或修改为：

     ```bash
     nameserver 8.8.8.8
     nameserver 114.114.114.114
     ```

     保存文件（按 

     ```bash
     Ctrl+O
     ```

     ，回车，然后按 

     ```bash
     Ctrl+X
     ```

      退出）。

#### 第六步：最终验证网络连接

完成上述所有步骤后，再次尝试ping以验证网络是否完全恢复。

1. **测试外部 IP 地址连通性：**

   ```bash
   ping 8.8.8.8
   ```

   - **预期结果：** 应该能看到数据包正常返回。

2. **测试域名解析和外部网络连通性：**

   ```bash
   ping www.baidu.com
   ```

   - **预期结果：** 应该能看到 `www.baidu.com` 被解析成一个 IP 地址并且数据包正常返回。

#### 第七步：配置静态IP（可选）

> 可参考教程：[（2024年最新）Linux（Ubuntu） 中配置静态IP（包含解决每次重启后配置文件失效问题）](https://blog.csdn.net/m0_74412436/article/details/144530016?spm=1011.2415.3001.5331)

1. 打开 **netplan** 配置文件

```bash
# 找到配置文件名
hua@hua-vm:~$ ls /etc/netplan/
01-network-manager-all.yaml

# 打开配置文件
hua@hua-vm:~$ sudo vim /etc/netplan/01-network-manager-all.yaml
```

2. 编辑 **netplan** 配置文件

```bash
network:
    version: 2
    renderer: networkd   # 使用 systemd-networkd 作为后端，对于静态 IP 配置，networkd 通常更为直接和稳定
    # renderer: NetworkManager   # 使用 NetworkManager 作为后端
    ethernets:
        ens33:
            dhcp4: false            # 使用静态 IP 
            addresses:
              - 192.168.220.128/24   # 静态 IP 和子网掩码
            routes:
              - to: default
                via: 192.168.220.2   # 默认路由
            nameservers:
                addresses:
                  - 8.8.8.8                 # DNS 服务器 1
                  - 114.114.114.114         # DNS 服务器 2
```

执行以下命令将权限设置为安全值：

```bash
sudo chmod 600 /etc/netplan/01-static-net.yaml
```

3. 处理潜在的配置文件冲突

​	**方案  (推荐 - 如果只使用静态 IP)：删除或禁用默认的网络管理文件。** 

​	如果自己的 `01-static-net.yaml` 已经包含了所有必要的配置（包括 `renderer: NetworkManager`，因为自	己的静态配置依赖它），那么默认的 `01-network-manager-all.yaml` 文件可能会导致冲突，或者至少是多余	的。可以将其删除或重命名以禁用它：

```bash
# 备份着不用
sudo mv /etc/netplan/01-network-manager-all.yaml /etc/netplan/01-network-manager-all.yaml.backup
# 或者直接删除，如果确定不需要它：
# sudo rm /etc/netplan/01-network-manager-all.yaml
```

​	这样做可以确保自己的 `01-static-net.yaml` 是==唯一==控制 `ens33` 的 Netplan 配置。

4. 重新应用 Netplan 配置

   在完成权限修正和可能的冲突处理后，再次尝试应用配置：

```bash
# 先检测配置，再根据提示应用配置
sudo netplan try

# 或者，如果确信配置无误，可以直接应用（不提供回滚选项）
sudo netplan apply
```

------

### 额外提示与注意事项

- **宿主机网络检查：** 确保自己的宿主机（运行虚拟机的电脑）可以正常访问互联网。如果宿主机本身没有网络，虚拟机自然也无法上网。
- **防火墙：** 极少数情况下，Ubuntu 内置的防火墙 UFW 可能会阻止连接。自己可以临时禁用它进行测试：`sudo ufw disable`。如果网络恢复，说明是防火墙问题，需要配置防火墙规则而不是禁用它。测试完记得 `sudo ufw enable` 重新启用。
- **Netplan 配置：** Ubuntu 22.04 使用 Netplan 管理网络配置，文件通常在 `/etc/netplan/*.yaml`。虽然我们的方法通过 `dhclient` 解决了问题，但如果将来出现持久性问题，可以检查这些文件内容（如 `cat /etc/netplan/*.yaml`），确保 `dhcp4: true` 配置正确。不过，在桌面版Ubuntu上，通常由 `NetworkManager` 负责管理，其配置文件非常简洁。
- **重启虚拟机：** 在某些情况下，简单地重启整个虚拟机可以解决一些临时的网络问题。