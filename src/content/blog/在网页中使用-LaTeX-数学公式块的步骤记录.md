---
title: "在网页中使用 LaTeX 数学公式块的步骤记录"
description: "在网页中使用 LaTeX 数学公式块的步骤记录"
publishDate: "2025-04-29"
tags:
  - "LaTex"
  - "HTML"
---

以下是**在网页中使用 LaTeX 数学公式块的完整步骤总结**，记录如何让网页正确渲染 LaTeX 数学表达式（如 `\(H(X) = -\sum p(x) \log p(x)\)` 这样的公式）：

------

## 使用 LaTeX 数学公式块的完整步骤（以 KaTeX 为例）

------

### 目标问题：

LaTeX 数学公式（如 `\(...\)` 或 `\[...\]`）在 HTML 页面中不会自动渲染为漂亮的数学样式，而是显示成原始字符串。

------

### 解决方案：

引入一个专门处理数学公式渲染的 JavaScript 库。推荐使用：

- **KaTeX**：速度快，样式精美，适合大多数需求。
- **MathJax**：更强大，支持复杂的 LaTeX 语法，但加载速度稍慢。

------

## 使用 KaTeX 实现数学公式渲染的步骤

------

### 步骤 1：引入 KaTeX 的 CSS 和 JS 文件

在你的 HTML 文件的 `<head>` 标签中添加以下内容：

```html
<!-- KaTeX for Math Rendering -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css" integrity="sha384-wcIxkf4k558fYv3mQP6ojKOqsMIqTeLQvrJcezUhkGWZoJaoGsdKrPYMNH8UmKzA" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js" integrity="sha384-hIoBPJpTUs74ddyc4bFZSM1TVlQDA60VBbJS0oA934VSz82sBx1jxWmkAVsyXtNg" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js" integrity="sha384-43gviWU0YVjaL4Ji4vLqEsIaaqpch6nzIuEepGIcTISLdUcGAvPu+6Zf0zLhc8yK" crossorigin="anonymous"></script>
<!-- End KaTeX -->
```

**说明：**

- `katex.min.css`：用于公式的样式。
- `katex.min.js`：核心库，处理解析与渲染。
- `auto-render.min.js`：自动查找和渲染页面上的数学表达式。

------

### 步骤 2：在 DOM 加载完成后初始化公式渲染

在 HTML 文件底部 `<body>` 标签前添加 JavaScript 初始化代码：

```html
<script>
    document.addEventListener("DOMContentLoaded", function () {
        if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},      // $$ 显示模式
                    {left: "\\[", right: "\\]", display: true},    // \[...\] 显示模式
                    {left: "\\(", right: "\\)", display: false}    // \(...\) 行内模式
                    // {left: "$", right: "$", display: false}     // 可选：使用单个 $ 包裹
                ],
                throwOnError: false
            });
        } else {
            console.warn("KaTeX auto-render script not loaded yet.");
        }
    });
</script>
```

**说明：**

- `renderMathInElement(document.body, {...})` 表示扫描整个页面 `<body>` 中的内容，自动识别数学表达式。
- `delimiters` 指定哪种 LaTeX 包裹方式会被识别：
  - `\( \)` 和 `\[ \]` 是 LaTeX 标准语法。
  - `$$ $$` 是常见的 display 模式替代形式。
- `throwOnError: false` 表示如果某个公式出错，页面继续正常渲染。

------

### 步骤 3：在 HTML 中写入公式（使用 LaTeX 语法）

你现在可以在 HTML 页面任意位置插入 LaTeX 数学表达式，例如：

```html
<p>信息熵的定义为：\\( H(X) = -\sum_{i=1}^{n} p(x_i) \log_b p(x_i) \\)</p>

<p>或者使用块状公式：</p>
<div>
    \[
        H(X) = -\sum_{i=1}^{n} p(x_i) \log_2 p(x_i)
    \]
</div>
```

------

## 最终效果

页面加载完成后，KaTeX 会自动扫描这些公式，并将其渲染为美观的数学公式样式，无需手动处理任何样式或标签。

------

## 注意事项

- KaTeX 不能渲染所有 LaTeX 宏，复杂公式请测试或参考官方文档。
- 页面中插入公式内容时，请避免 HTML 实体冲突（如 `<`、`&` 等）。
- 如果你使用 Markdown 转换器，也可以考虑 Markdown + KaTeX 的支持。