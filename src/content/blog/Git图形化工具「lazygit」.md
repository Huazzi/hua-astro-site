---
slug: "592108"
aliases:
  - git图形化工具lazygit
title: "Git图形化工具「lazygit」"
description: "Git图形化工具「lazygit」"
publishDate: "2025-01-29"
tags:
  - "Git"
  - "效率工具"
---



简要介绍一下偶然发现的Git图形化工具——「[lazygit](https://github.com/jesseduffield/lazygit)」



---

## 概述

Lazygit 是一个用 Go 语言编写的 Git 命令行界面（TUI）工具，它让 Git 操作变得更加直观和高效。

Github地址：https://github.com/jesseduffield/lazygit

![lazygit界面](https://cbc25ff.webp.li/hua-cdn/lazygit界面.png)



## 主要特点

**主要优势：**

1. 图形化界面 - 虽然是终端中运行，但提供了清晰的可视化界面，显示文件状态、分支、提交历史等
2. 键盘快捷操作 - 几乎所有 Git 操作都可以通过简单的快捷键完成
3. 交互式操作 - 可以方便地浏览文件变更、选择要暂存的内容、管理分支等



**常用功能：**

- 文件管理：查看未暂存/已暂存的变更，暂存/取消暂存文件
- 提交管理：创建提交、修改提交信息、查看提交历史
- 分支操作：创建、切换、合并分支
- 远程同步：拉取、推送、查看远程分支
- 冲突解决：可视化显示冲突，帮助解决合并冲突



**基本快捷键：**

```bash
? - 显示帮助面板

文件操作：
空格 - 暂存/取消暂存文件（相当于 git add <file> 或 git restore --staged <file>）
a - 暂存所有文件（相当于 git add .）
d - 查看文件变更（相当于 git diff）
D - 查看已暂存的变更（相当于 git diff --staged）

提交推送：
c - 提交（相当于 git commit）
p - 拉取（相当于 git pull）
P - 推送（相当于 git push）
f - 抓取远程更新（相当于 git fetch）

分支管理：
b - 查看分支列表（相当于 git branch）
n - 新建分支（相当于 git checkout -b <branch>）
M - 合并分支（相当于 git merge <branch>）

历史记录：
l - 查看提交日志（相当于 git log）
g - 查看文件提交历史（相当于 git log -p <file>）
r - 回滚提交（相当于 git reset 或 git revert）

其他：
w - 切换到另一个工作区（相当于 cd 到另一个 git 仓库）
q - 退出 lazygit
```



**安装方法：**

- macOS: `brew install lazygit`
- Linux: 可以通过包管理器安装，如 `apt install lazygit`
- Windows: 
  - 通过 Scoop 安装：`scoop install lazygit`
  - 通过 Winget 安装：`winget install -e --id=JesseDuffield.lazygit`




**使用建议：**

1. 刚开始使用时建议打开帮助面板（按 `?`）熟悉快捷键
2. 善用 Tab 键在不同面板间切换
3. 大多数操作都有确认步骤，不用担心误操作
4. 可以在配置文件中自定义快捷键和界面



## 总结

相比直接使用 Git 命令行，Lazygit 最大的优势在于它==降低了使用门槛==，让 Git 操作更加直观，特别适合 Git 新手使用。同时它的效率也很高，熟练掌握后可以大大提高版本控制的工作效率。