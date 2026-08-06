---
slug: "339994"
aliases:
  - windows包管理工具scoop
title: "Windows包管理工具「Scoop」"
description: "Windows包管理工具「Scoop」"
publishDate: "2025-01-29"
tags:
  - "Windows"
  - "Scoop"
  - "效率工具"
---



介绍Windows软件包管理工具——「[Scoop](https://scoop.sh/)」





### **一、Scoop 是什么？**

**Scoop** 是一款专为 Windows 设计的命令行软件包管理工具，它能让你像 Linux 系统一样通过命令快速安装、更新和卸载软件。其核心优势包括：

- **无需管理员权限**：默认安装在用户目录，避免权限问题。
- **绿色便携化**：软件独立存放，不污染系统注册表。
- **依赖自动处理**：自动配置环境变量和依赖项（如 Java、Python）。
- **海量软件仓库**：支持主流开发工具、实用小软件甚至 GUI 应用。

---

### **二、Scoop 安装教程**

#### **1. 安装前准备**

- **系统要求**：Windows 7+，建议 Windows 10/11。

- **PowerShell 版本**：

  - 推荐使用 PowerShell 5.1+（Windows 自带）。
  - 若使用 PowerShell Core，需确保语言模式为 `FullLanguage`。

- **执行策略设置**（必须）：

  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

#### **2. 三种安装方式**

##### **(1) 典型安装（推荐新手）**

- **适用场景**：快速安装到默认路径（`C:\Users\<用户名>\scoop`）。

- **操作步骤**：

  1. 以 **非管理员身份** 打开 PowerShell。

  2. 执行安装命令：

     ```powershell
     irm get.scoop.sh | iex
     ```

  - **国内镜像加速**（解决 GitHub 访问慢）：

    ```powershell
    irm https://ghproxy.com/raw.githubusercontent.com/ScoopInstaller/Install/master/install.ps1 | iex
    ```

---

##### **(2) 高级安装（自定义路径）**

- **适用场景**：需要指定安装目录或全局软件路径。

- **操作步骤**：

  1. 下载安装脚本：

     ```powershell
     irm get.scoop.sh -outfile 'install.ps1'
     ```

  2. 查看可配置参数：

     ```powershell
     .\install.ps1 -?
     ```

  3. 自定义安装（示例）：

     ```powershell
     .\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\ScoopGlobal' -NoProxy
     ```

     - `-ScoopDir`: 用户级软件路径
     - `-ScoopGlobalDir`: 全局软件路径（需管理员权限）
     - `-NoProxy`: 绕过系统代理

---

##### **(3) 静默安装（无交互）**

- **适用场景**：批量部署或脚本集成。

- **操作示例**：

  ```powershell
  .\install.ps1 -ScoopDir 'D:\Scoop' > install.log 2>&1
  if ($LASTEXITCODE -eq 0) { Write-Host "安装成功！" }
  ```

  - 使用 `> install.log` 记录日志。
  - 通过 `$LASTEXITCODE` 检查是否成功。

---

#### **3. 注意事项**

- **不要使用管理员模式**：默认安装无需管理员权限。
- **路径规范**：自定义路径避免空格和特殊字符（如 `Program Files`）。
- **旧版本迁移**：修改路径后需手动迁移已安装软件。

---

### **三、配置 Scoop 安装路径**

#### **1. 默认路径**

- **用户级软件**：`C:\Users\<用户名>\scoop\apps`
- **全局软件**（`-g`参数）：`C:\ProgramData\scoop\apps`

#### **2. 修改路径方法**

- **安装时指定**（推荐）：

  ```powershell
  .\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'E:\ScoopGlobal'
  ```

- **安装后修改**：

  ```powershell
  scoop config root D:\Scoop           # 用户级路径
  scoop config global_root E:\Scoop    # 全局路径（需管理员）
  ```

#### **3. 路径生效验证**

```powershell
scoop config | Select-Object root, global_root
```

---

### **四、Scoop 使用技巧**

#### **1. 常用命令速查**

| 命令                        | 说明                          |
| --------------------------- | ----------------------------- |
| `scoop install <软件名>`    | 安装软件                      |
| `scoop uninstall <软件名>`  | 卸载软件                      |
| `scoop update`              | 更新 Scoop 和软件列表         |
| `scoop update <软件名>`     | 更新指定软件                  |
| `scoop list`                | 查看已安装软件                |
| `scoop search <关键词>`     | 搜索软件包                    |
| `scoop bucket add <仓库名>` | 添加第三方仓库（如 `extras`） |

---

#### **2. 进阶技巧**

- **多仓库管理**：

  ```powershell
  scoop bucket add extras     # 常用 GUI 软件
  scoop bucket add versions   # 软件历史版本
  scoop bucket add java       # Java 开发工具
  ```

- **一键安装开发环境**：

  ```powershell
  scoop install git python nodejs vscode
  ```

- **清理旧版本**：

  ```powershell
  scoop cleanup *             # 删除所有软件旧版本
  scoop cache rm              # 清理下载缓存
  ```

- **代理设置**：

  > 很多时候直接使用 Scoop 下载安装软件速度会很慢，甚至下载失败，这时候可以通过`设置代理`的方式解决

  ```powershell
  scoop config proxy 127.0.0.1:7890  # 替换为你的代理端口
  ```

  

  > 未设置代理前，下载库失败；
  >
  > 设置代理后，下载库成功。（如下图所示）

  ![scoop设置代理](https://cbc25ff.webp.li/hua-cdn/scoop设置代理.png)

---

#### **3. 高效使用场景**

- **快速部署开发环境**：

  ```powershell
  scoop install neovim gcc make cmake
  ```

- **便携工具集**：

  ```powershell
  scoop install everything potplayer qbittorrent
  ```

- **系统维护**：

  ```powershell
  scoop install windirstat crystaldiskinfo
  ```

---

### **五、总结**

通过 Scoop，你可以彻底告别“百度软件站-下载-下一步安装”的传统流程，实现 **一键安装、更新和卸载**。结合自定义路径和多仓库管理，它将成为 Windows 上提升效率的神器。

*现在就开始你的 Scoop 之旅吧！*

```powershell
# 终极懒人包：安装常用工具
scoop install 7zip git everything potplayer vscode python
```



**参考**

[ScoopInstaller](https://github.com/ScoopInstaller/Install#readme)