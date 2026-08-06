---
slug: "572366"
aliases:
  - typora美化
title: "Typora美化"
description: "Typora美化"
publishDate: "2025-02-21"
tags:
  - "Typora"
  - "随笔"
---



今天对Typora的Github主题进行了一些自己喜欢的修改，主要包括：字体、代码块、表格样式



美化前：

![美化前效果](https://cbc25ff.webp.li/hua-cdn/20250221211604702.png)



美化后：

![美化后效果](https://cbc25ff.webp.li/hua-cdn/20250221211509673.png)

## 字体更换

> 之前便看上了「[中文网字计划](https://chinese-font.netlify.app/zh-cn/)」的「[朱雀仿宋](https://chinese-font.netlify.app/zh-cn/fonts/zqfs/ZhuqueFangsong-Regular)」字体，于是一直想更换字体，奈何自己拖延症作祟，直到今天才开始行动。

---

**关于「中文网字计划」**

「[中文网字计划](https://chinese-font.netlify.app/zh-cn/)」是一个致力于优化中文字体在互联网中应用的开源项目，通过Web Font技术为开发者提供便捷、免费的中文字体解决方案。其核心特点包括：

1. **字体分包技术**：将庞大的字体文件切割为小型静态分包，利用全球CDN加速加载，解决中文字体文件体积大、加载慢的问题；
2. **丰富字体库**：收录了霞鹛文楷、京華老宋体等众多字体，支持在线预览和按需调用；
3. **开源工具链**：提供字体分析工具（如`font-analyze`）、在线分包工具（[在线切割](https://chinese-font.netlify.app/online-split/)）及NPM包（`@konghayao/cn-font-split`），方便开发者自定义字体优化；
4. **全字符集渲染**：支持OpenType特性，可自动按页面内容加载所需字符区间，兼顾渲染速度与完整性。

项目官网为<https://chinese-font.netlify.app/>，GitHub仓库见[chinese-free-web-font-storage](https://github.com/KonghaYao/chinese-free-web-font-storage)。

需注意部分字体授权信息需自行确认，建议优先选用明确开源授权的字体（如霞鹛文楷）。

---

中文网字计划是支持直接使用它提供的CDN的，但是由于不知道怎么在主题的CSS中使用，于是选择使用更为直接的方法：从中文网字计划的Github仓库中下载下来这个字体的`.ttf`文件，然后在CSS中使用该字体。

**具体实现步骤**

1. 下载字体文件

- 下载自己想要的字体文件，例如[朱雀仿宋](https://github.com/KonghaYao/chinese-free-web-font-storage/blob/branch/packages/zqfs/fonts/ZhuqueFangsong-Regular.ttf)；

- 并将字体文件放到合适的目录位置，这个文件路径之后要用得到，例如我就是直接放到主题css文件的同一目录下，故引用的时候就直接使用相对路径`./字体文件名`。

2. 修改主题的css文件

- 引入本地字体

```css
/* 添加以下代码，引入本地字体 */
@font-face {
  /* 自定义字体名称 */
  font-family: "自定义字体";
  /* 字体文件路径 */
  src: url('./ZhuqueFangsong-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```



- 将需要的内容设置成自定义字体

```css
/* 将 body 设置为自定义字体 */
body {
  font-family: "自定义字体", "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial, 'Segoe UI Emoji', sans-serif;
  color: rgb(51, 51, 51);
  line-height: 1.6;
}

/* 将标题设置为自定义字体 */
h1,
h2,
h3,
h4,
h5,
h6 {
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 1.4;
  cursor: text;
  font-family: "自定义字体", "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial, 'Segoe UI Emoji', sans-serif;
}

/* 将段落、表格文字设置成自定义字体 */
p,
blockquote,
ul,
ol,
dl,
table {
  margin: 0.8em 0;
  font-family: "自定义字体", "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial, 'Segoe UI Emoji', sans-serif;
}
```

> 可以根据自己的需要自行设置



3. 重启Typora

不出意外的话，重启便能看到更换好字体之后的效果了



## 代码块装饰

> 希望能添加仿mac窗口风格的代码块上檐，觉得很好看。

类似下图：

![仿mac窗口风格的代码块上檐](https://cbc25ff.webp.li/hua-cdn/image-20250121230136626.png)



**已备条件**

先前在美化Hexo博客站的时候子在网上找到了大佬在Hexo的Fluid主题中实现仿mac窗口风格的[方法](https://github.com/fluid-dev/hexo-theme-fluid/issues/538#issuecomment-912535477)，即通过``自定义CSS`，并提供了`stylus代码`：

```stylus
.highlight
    background: #21252b
    border-radius: 5px
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4)
    padding-top: 30px

    &::before
      background: #fc625d
      border-radius: 50%
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b
      content: ' '
      height: 12px
      left: 12px
      margin-top: -20px
      position: absolute
      width: 12px
```



> 有了stylus代码，直接让 AI 帮忙改一下就可以用在这里了



**利用条件**

我们需要将这段 Stylus 代码适配到 Typora 的 GitHub 主题中，以下是修改后的 CSS 实现和详细说明：

```css
/* 在原有 .md-fences 样式基础上修改 */
.md-fences {
  background: #21252b;
  border-radius: 5px !important;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4) !important;
  padding-top: 30px !important;
  position: relative; /* 新增定位上下文 */
  margin: 15px 0;    /* 保持原有外边距 */
}

/* 添加 Mac 风格窗口按钮 */
.md-fences::before {
  content: ' ';
  position: absolute;
  top: 15px;         /* 调整垂直位置 */
  left: 15px;        /* 调整水平位置 */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fc625d;
  box-shadow: 20px 0 #fdbc40, 
             40px 0 #35cd4b;
  z-index: 1;        /* 确保按钮显示在代码上方 */
}

/* 调整代码内容位置 */
.md-fences .code-tooltip {
  margin-top: -20px; /* 补偿顶部 padding */
}

/* 保持代码区域高度 */
.md-fences pre {
  padding-top: 10px; /* 调整代码与按钮的间距 */
}
```

需要在你原来的主题 CSS 中找到 `.md-fences` 相关样式，替换或修改为上述代码。以下是主要修改点说明：

1. **定位上下文**：
   添加 `position: relative` 为伪元素定位提供基准

2. **窗口按钮实现**：
   使用 `::before` 伪元素创建三个圆形按钮，通过：

   - `box-shadow` 创建多个按钮
   - 精确的定位调整按钮位置
   - z-index 确保按钮可见

3. **样式覆盖**：
   使用 `!important` 覆盖 Typora 默认样式：

   ```css
   border-radius: 5px !important;
   box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4) !important;
   ```

4. **布局调整**：

   - 增加 `padding-top` 为按钮预留空间
   - 通过负 margin 保持代码区域位置
   - 调整代码内容的 padding

最终效果：

- 代码块顶部会有 macOS 风格的红黄绿按钮
- 代码块带有阴影和圆角
- 按钮位置适配代码块布局
- 保持原有代码高亮样式

如果需要调整按钮位置或颜色，可以修改以下参数：

- `top`/`left` 值：控制按钮位置
- `background` 值：红色按钮颜色
- `box-shadow` 值：黄色和绿色按钮颜色及位置
- `width`/`height`：按钮大小
- `border-radius`：按钮圆角程度

建议在修改后通过实际预览微调具体数值，不同主题可能需要不同的位置补偿值。



> 对`box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4) !important;` 的解释：
>
> 给元素添加一个**向下偏移**的**半透明模糊阴影**，具体参数解析如下：
>
> 1. **`0`**：水平偏移量（h-shadow）
>    表示阴影在水平方向不偏移
>
> 2. **`10px`**：垂直偏移量（v-shadow）
>    表示阴影向下偏移10像素（负值会向上偏移）
>
> 3. **`30px`**：模糊半径（blur） 
>    阴影边缘会产生30像素的模糊渐变效果，数值越大越模糊
>
> 4. **`0`**：扩散半径（spread） 
>    阴影大小与元素原始尺寸一致（正值扩大阴影，负值收缩）
>
> 5. **`rgba(0, 0, 0, .4)`**：阴影颜色 
>    使用黑色（#000）且透明度为40%（0.4），通过透明度实现阴影深浅控制
>
> 6. **`!important`**：优先级标记 
>    强制覆盖其他可能存在的阴影样式规则
>
> 最终效果表现为：元素下方会呈现一个向下延伸10px、模糊范围30px、半透明黑色（类似雾状）的阴影层，常用于创建卡片浮起效果或增强界面层次感。

---



2025.2.22更新修改



主要修改：

- 顶部仿mac的背景颜色变为深色，下方的代码部分背景颜色不变
- 上次改动使得代码块的行高发生变化，过于高了，现将行高改的合适一些

要实现 **顶部仿 Mac 按钮区域为深色背景**，而**下方代码区域保持浅色**，需要通过 **分层背景控制** 和 **伪元素定位** 来实现。以下是具体修改方案：

---

### 修改后的完整 CSS 代码

```css
/* 核心修改部分 */
.md-fences {
  /* 移除整体深色背景 */
  background: transparent !important;
  /* 保持原有容器样式 */
  border-radius: 5px !important;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .1) !important;
  padding-top: 25px !important;
  padding-bottom: 2px !important;
  position: relative;
  margin: 15px 0;
  /* 添加浅色边框分隔 */
  border: 3px solid #e7eaed;
}

/* 新增：顶部深色背景条 */
.md-fences::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* 与 padding-top 一致 */
  height: 25px;
  /* 原深色背景 */
  background: #21252b;
  /* 仅顶部圆角 */
  border-radius: 5px 5px 0 0;
  /* 确保在按钮下方 */
  z-index: 0;
}

/* 调整 Mac 按钮层级 */
.md-fences::before {
  /* 原有按钮样式不变 */
  content: ' ';
  position: absolute;
  top: 10px;
  left: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fc625d;
  box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
  margin-top: 0px;
  /* 提升到顶部背景条之上 */
  z-index: 2;
}

/* 恢复代码区域背景色 */
.md-fences pre {
  /* 原浅色背景 */
  background: #f8f8f8 !important;
  margin: 0;
  padding: 10px 15px !important; /* 需删去 */
  /* 底部圆角 */
  border-radius: 0 0 5px 5px;
  position: relative;
  /* 确保在顶部背景条之上 */
  z-index: 1;
}
```

---

### 关键修改说明

通过 **三层结构** 实现分层控制：

1. **顶部深色背景条** (`::after` 伪元素)
   - 高度与容器的 `padding-top` 一致（30px）
   - 仅设置顶部圆角，与容器圆角匹配
   - 使用 `z-index: 0` 作为底层

2. **Mac 风格按钮** (`::before` 伪元素)
   - 提升 `z-index: 2` 确保按钮显示在顶部背景条之上
   - 保持原有定位和样式

3. **代码内容区域** (`pre` 标签)
   - 显式设置浅色背景 `#f8f8f8`
   - 添加 `z-index: 1` 覆盖顶部背景条
   - 底部圆角避免背景色溢出



按照上面修改好之后，发现代码块的行高高的离谱，原本以为是行高太大的问题，于是就直接加了一行行高控制（如下所示）：

```css
/* 新增行高控制 */
line-height: 1.5 !important; /* 合适的范围：1.4-1.6*/
```

发现没有效果，进而才想到了可能是`padding`的问题，于是便尝试将代码块的`padding`控制元素给注释掉，发现行高恢复正常了，问题找到，只要**删去padding**即可。

*上面的代码是先直接让deepseek帮忙写的，事实证明：AI确实能提高编程速度，但仍不能完全代替人类进行工作。*

---

### 效果验证

| 区域         | 背景色          | 特性                     |
| ------------ | --------------- | ------------------------ |
| 顶部按钮区域 | 深色(#21252b)   | 包含 Mac 风格红黄绿按钮  |
| 代码内容区域 | 浅色(#f8f8f8)   | 保持原有代码样式和行间距 |
| 容器边框     | 浅灰色(#e7eaed) | 分隔顶部深色和代码区域   |

---

### 调整细节（按需修改）

- **顶部背景条高度**：修改 `.md-fences::after` 的 `height` 值（需同步调整容器的 `padding-top`）
- **代码区域边距**：调整 `.md-fences pre` 的 `padding` 值
- **圆角一致性**：检查 `border-radius` 数值是否与容器匹配

最终效果应实现 **顶部深色按钮区 + 下方浅色代码区** 的视觉分层，同时保持代码内容的原有样式。



## 表格样式修改

> 将原主题的表格样式改成`三线表`样式

以下是修正后的三线表完整CSS代码：

将原CSS中的相关样式用以下替换即可

```css
/* ================= 三线表完整样式 ================= */
table {
  border-collapse: collapse;
  border-spacing: 0;
  border: none;
  margin: 1.5em 0;
}

/* 顶线 */
table {
  border-top: 2px solid #333;
}

/* 底线 */
table {
  border-bottom: 2px solid #333;
}

/* 表头线（中间线） */
thead tr:first-child th {
  border-bottom: 1.5px solid #666;
}

/* 单元格样式 */
td,
th {
  border: none;
  padding: 8px 12px;
  background: transparent;
}

/* 表头文字样式 */
th {
  font-weight: 600;
  color: #2c3e50;
}

/* 移除斑马纹 */
tr:nth-child(2n) {
  background: transparent !important;
}

/* 调整对齐方式 */
th {
  text-align: center !important;
}

td {
  text-align: center;
}
```

修改要点说明：

1. 明确三条线的实现方式：
   - 顶线：`table`元素的顶部边框（2px）
   - 中间线：表头单元格(th)的底部边框（1.5px）
   - 底线：`table`元素的底部边框（2px）

2. 颜色层级：
   - 顶/底线使用深灰色（#333）
   - 中间线使用稍浅的灰色（#666）

3. 增强可读性：
   - 表头文字加粗（600字重）
   - 表头文字颜色加深（#2c3e50）
   - 单元格增加横向间距（8px→12px）

实际效果预览：

```
__________________________ 顶线（2px）
 姓名    年龄    职位
__________________________ 中间线（1.5px）
 张三     28    工程师
 李四     35    设计师
__________________________ 底线（2px）
```

验证方法：

1. 在Typora中插入3行2列的表格
2. 观察是否呈现：
   - 顶部粗线
   - 表头下方细线
   - 底部粗线
3. 检查是否没有其他干扰线条

如果希望调整线条粗细，可以修改以下参数：

- 顶/底线粗细：`2px` → 推荐范围 1.5px-3px
- 中间线粗细：`1.5px` → 推荐范围 1px-2px