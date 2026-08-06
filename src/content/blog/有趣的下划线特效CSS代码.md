---
slug: "748489"
aliases:
  - 有趣的下划线特效css代码
title: "有趣的下划线特效CSS代码"
description: "有趣的下划线特效CSS代码"
publishDate: "2025-04-29"
tags:
  - "css"
---

> 原教程：https://www.bilibili.com/video/BV1S5wEeAEre/

## 效果预览

![渐变色下划线动画效果](https://cbc25ff.webp.li/UnderLine-Motion.gif)

## 完整代码实现

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>渐变色下划线动画</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }

        .title {
            text-align: center;
            line-height: 1.5;
            font-size: 2.5rem;
            color: #333;
        }
      
        .underline-animation {
            /* 初始状态：完全透明 */
            background: linear-gradient(to right, #ec695c, #61c454) no-repeat right bottom;
            background-size: 0 3px;
            transition: background-size 0.5s ease-in-out;
            padding-bottom: 2px;
        }
      
        .underline-animation:hover {
            /* 悬停状态：完全显示 */
            background-position-x: left;
            background-size: 100% 3px;
        }
    </style>
</head>
<body>
    <h1 class="title">
        <span class="underline-animation">悬停查看渐变色下划线效果</span>
    </h1>
</body>
</html>
```

## 技术原理

### 1. 渐变背景的妙用

核心代码使用`linear-gradient`创建水平渐变背景：

```css
background: linear-gradient(to right, #ec695c, #61c454) no-repeat right bottom;
```

- `to right`：指定渐变方向从左到右
- `#ec695c`到`#61c454`：从橙红色到绿色的渐变
- `no-repeat`：禁止背景重复
- `right bottom`：初始位置设置在右下角

### 2. 动态尺寸变换

通过`background-size`控制下划线的显示范围：

```css
background-size: 0 3px; /* 初始状态：宽度为0，高度3px */
```

悬停时扩展为：

```css
background-size: 100% 3px; /* 悬停状态：宽度100%，高度3px */
```

### 3. 平滑过渡效果

`transition`属性实现动画效果：

```css
transition: background-size 0.5s ease-in-out;
```

- 属性：只对`background-size`变化应用过渡
- 时长：0.5秒完成动画
- 缓动函数：`ease-in-out`使动画更自然


