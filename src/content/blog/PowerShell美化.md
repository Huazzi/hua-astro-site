---
title: "PowerShell美化"
description: "PowerShell美化"
publishDate: "2025-03-01"
tags:
  - "PowerShell"
  - "美化"
---



参考文章：[windows terminal美化教程](https://blog.csdn.net/weixin_51551506/article/details/137465202)



### 主要步骤

#### 1. 安装Windows Terminal

- 方式一：「微软商店」下载安装Windows Terminal

- 方式二：使用`winget`安装

  ```powershell
  winget install --id Microsoft.WindowsTerminal -e
  ```

  

#### 2. 下载安装字体

- 我的字体：[JetBrainsMonoNerdFont-Regular](https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFont-Regular.ttf)

- 下载后`双击`安装

- 在Windows Terminal设置中使用字体

  ![在Windows Terminal设置安装的字体](https://cbc25ff.webp.li/hua-cdn/%E8%AE%BE%E7%BD%AE%E5%AD%97%E4%BD%93.png)



#### 3. 安装oh-my-posh

- 方式一：「微软商店」安装
- 方式二：使用`winget`安装：

```powershell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

> 顺带安装了`Get-ChildItemColor`和`posh-git`
>
> ![顺带的安装内容](https://cbc25ff.webp.li/hua-cdn/顺带的安装内容.png)



添加`PATH`路径：

```powershell
$env:Path += "C:\Users\user\AppData\Local\Programs\oh-my-posh\bin"
```



#### 4. 配置oh-my-posh

- **创建配置文件：**

  ```powershell
  New-Item -Path $PROFILE -Type File -Force
  ```

- **编辑配置文件：**

  ```powershell
  notepad $PROFILE
  ```

  > **配置文件位置：**
  >
  > `C:\Users\<userName>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`

**主要改动：**

> oh-my-posh不再需要模块导入，需要在配置文件中删去，否则一直弹出提示
>
> ![oh-my-hosh不再需要模块安装](https://cbc25ff.webp.li/hua-cdn/oh-my-hosh不再需要模块安装.png)
>
> [问题描述](https://ohmyposh.dev/docs/migrating)



**配置文件内容：**

```powershell
[System.Console]::OutputEncoding=[System.Text.Encoding]::GetEncoding(65001) # 配置默认编码
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\atomic.omp.json" | Invoke-Expression # 配置oh-my-posh的theme

#------------------------------- Import Modules BEGIN -------------------------------
# 引入 ps-read-line
Import-Module PSReadLine
 
# 引入 posh-git
Import-Module posh-git
 
# 引入 oh-my-posh —>更新：删除oh-my-posh的模块导入
# Import-Module oh-my-posh
 
# 设置 PowerShell 主题 —> 更新：删除
# Set-PoshPrompt ys
# Set-PoshPrompt cinnamon
#------------------------------- Import Modules END   -------------------------------
 
#-------------------------------  Set Hot-keys BEGIN  -------------------------------
# 设置预测文本来源为历史记录
Set-PSReadLineOption -PredictionSource History
 
# 每次回溯输入历史，光标定位于输入内容末尾
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
 
# 设置 Tab 为菜单补全和 Intellisense
Set-PSReadLineKeyHandler -Key "Tab" -Function MenuComplete
 
# 设置 Ctrl+d 为退出 PowerShell
Set-PSReadlineKeyHandler -Key "Ctrl+d" -Function ViExit
 
# 设置 Ctrl+z 为撤销
Set-PSReadLineKeyHandler -Key "Ctrl+z" -Function Undo
 
# 设置向上键为后向搜索历史记录
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
 
# 设置向下键为前向搜索历史纪录
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
#-------------------------------  Set Hot-keys END    -------------------------------
```



其中，

`atomic.omp.json`为所选的主题文件，可以在 「[Themes | Oh My Posh](https://ohmyposh.dev/docs/themes) 」这里找到自己喜欢的主题名称。

配置完成后关闭 `terminal` 重新开发就可以看到新的主题了。





- 保存文件，重启终端



---

篇结。