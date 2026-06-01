---
title: "Fluid主题背景图全屏化与切换"
description: "Fluid主题背景图全屏化与切换"
publishDate: "2025-03-01"
tags:
  - "Fluid"
  - "美化"
---



对Hexo+Fluid博客进行一些样式改造，主要包括以下三个方面：

  1. 固定背景图
  2. 切换颜色主题切换不同背景图
  3. 文字主板毛玻璃效果

*参考文章：*

 - **4rozeN**的「[fluid 全屏背景图随日夜模式切换和正文底页毛玻璃效果](https://4rozen.github.io/archives/Hexo/60191.html)」
 - **清山**的「[Hexo Fluid主题背景固定(ES6改写版)与毛玻璃底页](https://qingshaner.com/Hexo%20Fluid%E4%B8%BB%E9%A2%98%E8%83%8C%E6%99%AF%E5%9B%BA%E5%AE%9A(ES6%E6%94%B9%E5%86%99%E7%89%88)%E4%B8%8E%E6%AF%9B%E7%8E%BB%E7%92%83%E5%BA%95%E9%A1%B5/)」



## 1. 固定背景图

使用Fluid主题的**[注入代码](https://fluid-dev.github.io/hexo-fluid-docs/advance/#fluid-%E6%B3%A8%E5%85%A5%E4%BB%A3%E7%A0%81)**功能，实现无代码侵入地为博客添加样式：

- 在博客根目录下新建一个`scripts`文件夹，再在这个文件夹中新建一个`injector.js`文件：

```
blog_root/--
		 |
		 |--scripts/--
		           |
		 	       |--injector.js
```



- 编写`injector.js`内容：

```js
// 注入背景容器
const { root: siteRoot = "/" } = hexo.config;
hexo.extend.injector.register("body_begin", `<div id="web_bg"></div>`);
hexo.extend.injector.register("body_end",`<script src="${siteRoot}js/backgroundize.js"></script>`);
```



这两步就能够实现固定背景图的功能了。

> 由于是使用了**注入代码**功能，上面这个JS文件不用像在`source/js/`下的js文件那样，还需在主题配置文件`_config.fluid.yml`中加入`- /js/name.js`引用。



## 2.切换颜色主题自动更换背景图

> 这步我是参照**4rozeN**的[fluid 全屏背景图随日夜模式切换和正文底页毛玻璃效果](https://4rozen.github.io/archives/Hexo/60191.html)进行实现的，（也可能是我自己在照做的过程中与原文有出入），我完全按照原文操作之后发现并没有达到预期的效果，点击切换颜色主题之后背景图并没有随着发生变化。

在原来的基础上进行一些改动之后能实现预期效果了，并在原来的基础上进行功能改进：

- **改进功能**：*原来只能实现一个颜色主题只能使用一张背景，这里进一步实现了不同颜色主题的不同页面的可以设置不同的背景图片。*
- **缺点**：增加了代码量，会拖慢速度。



**具体实现**

（1）在 `source/js`目录中新建背景修改 `backgroundize.js` 文件，我的代码内容如下（没有添加代码折叠，所以会比较占地方）：

```js
/**
 * Fluid主题日夜模式和页面类型背景切换
 */

// 定义不同页面类型和主题模式下的背景图片
const BACKGROUNDS = {
  home: { light: {}, dark: {} },
  post: { light: {}, dark: {} },
  archive: { light: {}, dark: {} },
  category: { light: {}, dark: {} },
  tag: { light: {}, dark: {} },
  about: { light: {}, dark: {} },
  links: { light: {}, dark: {} },
  default: { light: {}, dark: {} }
};

// 为每个配置添加桌面和移动设备属性
for (const page in BACKGROUNDS) {
  BACKGROUNDS[page].light.desktop = `var(--${page}-bg-image-light)`;
  BACKGROUNDS[page].light.mobile = `var(--${page}-bg-image-light-mobile)`;
  BACKGROUNDS[page].dark.desktop = `var(--${page}-bg-image-dark)`;
  BACKGROUNDS[page].dark.mobile = `var(--${page}-bg-image-dark-mobile)`;
}

// 缓存DOM元素和状态
let cachedThemeMode = null;
let cachedPageType = null;
let cachedIsMobile = null;
let webBgElement = null;
let updateTimeout = null;

/**
 * 检测当前的主题模式
 */
function detectThemeMode() {
  const storedTheme = localStorage.getItem('Fluid_Color_Scheme');
  const isDarkClass = document.body.classList.contains('dark-mode') || 
                      document.body.classList.contains('dark') ||
                      document.documentElement.classList.contains('dark');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  return (storedTheme === 'dark' || (storedTheme === null && isDarkClass) || 
         (storedTheme === null && !isDarkClass && prefersDark)) ? 'dark' : 'light';
}

/**
 * 检测当前页面类型
 */
function detectPageType() {
  const path = window.location.pathname;
  const bodyClasses = document.body.classList;
  
  // 基于URL路径检测
  if (path === '/' || path === '/index.html') return 'home';
  if (path.includes('/post/') || path.includes('/posts/') || path.includes('/article/')) return 'post';
  if (path.includes('/archives/') || path.includes('/archive/')) return 'archive';
  if (path.includes('/categories/') || path.includes('/category/')) return 'category';
  if (path.includes('/tags/') || path.includes('/tag/')) return 'tag';
  if (path.includes('/about/')) return 'about';
  if (path.includes('/links/')) return 'links';
  
  // 基于body类名检测
  if (bodyClasses.contains('index')) return 'home';
  if (bodyClasses.contains('post-template') || bodyClasses.contains('post')) return 'post';
  if (bodyClasses.contains('archive-template') || bodyClasses.contains('archive')) return 'archive';
  if (bodyClasses.contains('category-template') || bodyClasses.contains('category')) return 'category';
  if (bodyClasses.contains('tag-template') || bodyClasses.contains('tag')) return 'tag';
  if (bodyClasses.contains('about-template') || bodyClasses.contains('about')) return 'about';
  if (bodyClasses.contains('links-template') || bodyClasses.contains('links')) return 'links';
  
  // 特定页面元素检测
  if (document.querySelector('.post-content')) return 'post';
  if (document.querySelector('.archive-list')) return 'archive';
  if (document.querySelector('.category-list')) return 'category';
  if (document.querySelector('.tag-list')) return 'tag';
  if (document.querySelector('.about-content')) return 'about';
  if (document.querySelector('.links-list')) return 'links';
  
  return 'default';
}

/**
 * 设置背景图片 - 只在需要时更新
 */
function updateBackgroundImage() {
  // 防止短时间内多次调用
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  
  updateTimeout = setTimeout(() => {
    // 获取当前状态
    const themeMode = detectThemeMode();
    const pageType = detectPageType();
    const isMobile = window.innerWidth < 768;
    
    // 如果DOM元素还未缓存，获取它
    if (!webBgElement) {
      webBgElement = document.querySelector('#web_bg');
      if (!webBgElement) return;
    }
    
    // 当状态变化时才更新背景
    if (themeMode !== cachedThemeMode || 
        pageType !== cachedPageType || 
        isMobile !== cachedIsMobile) {
      
      // 更新缓存的状态
      cachedThemeMode = themeMode;
      cachedPageType = pageType;
      cachedIsMobile = isMobile;
      
      // 获取对应背景
      const bgConfig = BACKGROUNDS[pageType] || BACKGROUNDS.default;
      const bgImage = isMobile ? bgConfig[themeMode].mobile : bgConfig[themeMode].desktop;
      
      // 应用背景图片
      webBgElement.style.backgroundImage = bgImage;
      
      // 重置Banner样式
      const banner = document.querySelector("#banner");
      const mask = document.querySelector("#banner .mask");
      
      if (banner) banner.style.backgroundImage = 'none';
      if (mask) mask.style.backgroundColor = 'rgba(0,0,0,0)';
    }
    
    updateTimeout = null;
  }, 50);
}

/**
 * 初始化
 */
function init() {
  // 初始化背景
  updateBackgroundImage();
  
  // 设置主题切换监听器
  const themeToggleBtn = document.querySelector('#color-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', updateBackgroundImage);
  }
  
  // localStorage变化
  window.addEventListener('storage', (event) => {
    if (event.key === 'Fluid_Color_Scheme') {
      updateBackgroundImage();
    }
  });
  
  // body类变化
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        updateBackgroundImage();
        break;
      }
    }
  });
  
  observer.observe(document.body, { attributes: true });
  observer.observe(document.documentElement, { attributes: true });
  
  // 系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', updateBackgroundImage);
  
  // 窗口大小变化
  window.addEventListener('resize', updateBackgroundImage, { passive: true });
  
  // 监听点击事件，捕获内部导航
  document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (target && target.href && target.href.includes(window.location.hostname)) {
      setTimeout(updateBackgroundImage, 100);
    }
  });
  
  // 浏览器历史记录变化
  window.addEventListener('popstate', () => {
    setTimeout(updateBackgroundImage, 100);
  });
  
  // 观察内容变化
  const contentObserver = new MutationObserver((mutations) => {
    if (mutations.some(mutation => 
      mutation.type === 'childList' && 
      (mutation.addedNodes.length > 3 || mutation.removedNodes.length > 3)
    )) {
      setTimeout(updateBackgroundImage, 100);
    }
  });
  
  // 观察主要内容区域
  const contentAreas = [
    document.querySelector('main'),
    document.querySelector('#main'),
    document.querySelector('.container'),
    document.querySelector('.content')
  ].filter(Boolean);
  
  contentAreas.forEach(area => {
    contentObserver.observe(area, { 
      childList: true, 
      subtree: true 
    });
  });
}

// 页面初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 提供手动触发更新的方法
window.updatePageBackground = function() {
  updateBackgroundImage();
  return `已手动更新背景，页面类型: ${detectPageType()}, 主题模式: ${detectThemeMode()}`;
};
```



（2）添加CSS文件：`source/css/backgroundize.css`，内容如下：

```css
/* 参考教程：https: //4rozen.github.io/archives/Hexo/60191.html */
:root {
  /* 首页背景 */
  --home-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/street01.png');
  --home-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --home-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg');
  --home-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/b08.jpg');

  /* 文章页背景 */
  --post-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/free-cute.png');
  --post-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --post-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/m013.jpg');
  --post-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/b08.jpg');

  /* 归档页背景 */
  --archive-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/street01.png');
  --archive-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --archive-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg');
  --archive-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/b08.jpg');

  /* 标签页背景 */
  --tag-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/street01.png');
  --tag-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --tag-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg'); 
  --tag-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/b08.jpg');

  /* 分类页背景 */
  --category-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/street01.png');
  --category-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --category-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg');
  --category-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/b08.jpg');

  /* 关于页背景 */
  --about-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/street01.png');
  --about-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --about-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg');
  --about-bg-image-dark-mobile: url('https://cbc25ff.web.li/hua-cdn/b08.jpg');

  /* 友链页背景 */
  --links-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/LongMao.webp');
  --links-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/LongMao_m.jpg');
  --links-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg');
  --links-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/LongMao_m.jpg');

  /* 默认背景（可以重复使用其他背景，或设置新背景） */
  --default-bg-image-light: url('https://cbc25ff.webp.li/hua-cdn/street01.png');
  --default-bg-image-light-mobile: url('https://cbc25ff.webp.li/hua-cdn/m0.jpg');
  --default-bg-image-dark: url('https://cbc25ff.webp.li/hua-cdn/b2.jpg');
  --default-bg-image-dark-mobile: url('https://cbc25ff.webp.li/hua-cdn/b08.jpg');
}

#web_bg {
  /* 触发GPU加速 */
  will-change: background-image;
  /* 启用CSS Containment */
  content-visibility: auto;
  background-image: var(--desktop-bg-image-normal);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  /* 添加过渡效果 */
  transition: all 0.5s;
}
```





注意：

这里的`backgroundzie.js`和`backgroundize.css`要在「主题配置文件`_config.fluid.yml`」中添加到用户自定义js和用户自定义css中进行启用。

 ```yml
custom_js:
   - /js/backgroundize

 custom_css:
  - /css/backgroundize
 ```



---

篇结。