---
title: "Fluid主题自定义字体"
description: "Fluid主题自定义字体"
publishDate: "2025-01-01"
updatedDate: "2025-02-22"
tags:
  - "Fluid"
  - "美化"
---



在Hexo的Fluid主题中使用自定义字体





## 实现方法

Fluid提供了「[自定义 JS / CSS / HTML](https://hexo.fluid-dev.com/docs/guide/#%E8%87%AA%E5%AE%9A%E4%B9%89-js-css-html)」的方式，如果你想引入外部的 JS、CSS（比如 IconFont）或 HTML，可以通过以下**主题配置**，具体见注释：

```yaml
# 指定自定义 js 文件路径，路径是相对 source 目录
custom_js: /js/custom.js

# 指定自定义 css 文件路径，路径是相对 source 目录
custom_css: /css/custom.css

# 自定义 <head> 节点中的 HTML 内容
custom_head: '<meta name="key" content="value">'

# 自定义底部 HTML 内容（位于 footer 上方），也可用于外部引入 js css 这些操作，注意不要和 post.custom 配置冲突
custom_html: '<link rel="stylesheet" href="//at.alicdn.com/t/font_1067060_qzomjdt8bmp.css">'
```



另外 `custom_js` 和 `custom_css` 都可以指定多个路径：

```yaml
custom_css:
  - /css/macpanel
  - /css/nav_tittle
  - /css/custom_fonts
```



## 具体步骤

1. 创建CSS文件

​	在博客跟目录的 `node_modules\hexo-theme-fluid\source\css` 或 `themes\fluid\source\css` 目录下，创建一个`custom_fonts.css`（文件名随意）文件，用于设置自定义的字体样式。

2. 在CSS中设置自定义字体样式

（我在这里主要使用了「[中文网字计划](https://chinese-font.netlify.app/zh-cn/)」的[朱雀仿宋字](https://chinese-font.netlify.app/zh-cn/fonts/zqfs/ZhuqueFangsong-Regular)体）

```css
/* 创建文件: themes/fluid/source/css/custom_font.css */

/* 引入字体 */
@import url(https://chinese-fonts-cdn.deno.dev/packages/zqfs/dist/ZhuqueFangsong-Regular/result.css);

body,   /* 全局使用自定义字体 */
h1,     /* 标题使用自定义字体 */
h2,
h3,
h4,
h5,
h6,
.markdown-body, /* 文章内容使用自定义字体 */
.navbar,        /* 导航栏使用自定义字体 */
.side-catalog,  /* 侧边栏使用自定义字体 */
footer {        /* 页脚使用自定义字体 */
  font-family: "Zhuque Fangsong (technical preview)", KaiTi, "楷体", "楷体_GB2312", STKaiti, "华文楷体", serif !important;
}

/* 子标题字体 */
#subtitle {
  font-family: "Zhuque Fangsong (technical preview)", serif !important;
}

/* 浮动光标字体 */
.typed-cursor {
  font-family: "微软雅黑", "Microsoft YaHei", "宋体", "SimSun", sans-serif !important;
}
```



3. 启用自定义.css 文件

​	在Fluid的「主题配置文件」中（一般是在博客根目录下的`_config.fluid.yml` 或 `"node_modules\hexo-theme-fluid\_config.yml"`），启用上面写好的自定义.css 文件：

> 需要注意一下自定义 .css 文件路径要确保无误

```yaml
# 指定自定义 .css 文件路径
custom_css:
  - /css/custom_fonts
```



4. 重启博客

*完成！*